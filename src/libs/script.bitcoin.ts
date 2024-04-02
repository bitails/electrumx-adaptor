import * as bsv from 'bsv';

import { BitcoinNetwork, OutputType } from 'types/bitcoin';

export class BitcoinScript {
  static decodeKnownPayment(
    type: OutputType,
    script: string,
    network: BitcoinNetwork,
  ): { type: OutputType; addresses?: string[]; reqSigs?: number } {
    const decodedScript = new bsv.Script(script);
    if (!['pubkey', 'pubkeyhash', 'multisig'].includes(type)) {
      return {
        type,
      };
    }
    if (type === 'pubkey') {
      return {
        type,
        addresses: [
          new bsv.PublicKey(decodedScript.getPublicKey().toString('hex'))
            .toAddress(network)
            .toString(),
        ],
      };
    }
    if (type === 'pubkeyhash') {
      return {
        type,
        addresses: [decodedScript.toAddress(network).toString()],
        reqSigs: 1,
      };
    }
    if (type === 'multisig') {
      const asm = decodedScript.toASM().split(' ');
      const isMultiSig = asm.pop();
      if (isMultiSig !== 'OP_CHECKMULTISIG') {
        return {
          type,
        };
      }
      const pubKeysCount = Number(asm.pop().split('_')[1]);
      const pubKeys = [];
      for (let i = 0; i < pubKeysCount; i++) {
        pubKeys.push(asm.pop());
      }
      const requireSigs = Number(asm.pop().split('_')[1]);

      return {
        type,
        reqSigs: requireSigs,
        addresses: pubKeys
          .map((pk) => new bsv.PublicKey(pk).toAddress(network).toString())
          .reverse(),
      };
    }
  }

  static decodePayment(
    script: string,
    network: BitcoinNetwork,
  ): {
    type: OutputType;
    addresses?: string[];
    reqSigs?: number;
  } {
    //#TODO can improve by detect without decode script
    const decodedScript = new bsv.Script(script);
    const type = decodedScript?.isPublicKeyOut()
      ? 'pubkey'
      : decodedScript?.isMultisigOut()
        ? 'multisig'
        : decodedScript?.isPublicKeyHashOut()
          ? 'pubkeyhash'
          : 'nonstandard';

    return BitcoinScript.decodeKnownPayment(type, script, network);
  }
  static decodeTransaction(rawtx: string): string {
    const decodedTransaction = new bsv.Transaction(Buffer.from(rawtx, 'hex'));
    return decodedTransaction.id;
  }

  static asm(script: string) {
    try {
      return new bsv.Script(script).toASM();
    } catch (e) {
      return '';
    }
  }
}
