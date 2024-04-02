import {
  BitailsInput,
  BitailsOutput,
  BitailsScripthashHistory,
} from 'types/bitails';

import { BitcoinNetwork } from 'types/bitcoin';
import { BitcoinScript } from './script.bitcoin';
import { ElectrumXHistory } from 'types/electrumx';

export class Convertor {
  static bitailsInputIntoElectrumXInput(input: BitailsInput): {
    scriptSig: {
      asm: string;
      hex: string;
    };
    sequence: number;
    txid: string;
    vout: number;
  } {
    return {
      txid: input.source.txid,
      vout: input.source.index,
      scriptSig: {
        asm: input.scriptSig ? BitcoinScript.asm(input.scriptSig) : '',
        hex: input.scriptSig,
      },
      sequence: input.sequence,
    };
  }

  static bitailsOutputIntoElectrumXOutput(
    output: BitailsOutput,
    network: BitcoinNetwork,
  ): {
    n: number;
    scriptPubKey: {
      addresses: string[];
      asm: string;
      hex: string;
      reqSigs: number;
      type: string;
    };
    value: number;
  } {
    const { type, addresses, reqSigs } = BitcoinScript.decodeKnownPayment(
      output.type,
      output.script,
      network,
    );

    return {
      n: output.index,
      value: output.satoshis / 100000000,
      scriptPubKey: {
        addresses,
        asm: output.script ? BitcoinScript.asm(output.script) : '',
        hex: output.script,
        reqSigs: reqSigs,
        type: type,
      },
    };
  }

  static bitailsScripthashHistoryIntoElectrumX(
    data: BitailsScripthashHistory,
  ): ElectrumXHistory[] {
    return data.history.map((history) => ({
      tx_hash: history.txid,
      height: history.blockheight,
    }));
  }

  static bitailsScripthashUn;
}
