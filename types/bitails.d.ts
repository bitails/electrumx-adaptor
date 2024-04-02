import { OutputType } from './bitcoin';

export interface BitailsScripthashHistory {
  scripthash: string;
  history: {
    txid: string;
    inputSatoshis: number;
    outputSatoshis: number;
    time: number;
    blockheight: number;
  }[];
  pgKey: string;
}
export interface BitailsTransaction {
  txid: string;
  size: number;
  locktime: number;
  blockhash: string;
  blockheight: number;
  blocktime: number;
  confirmations: number;
  inblockIndex: number;
  time: number;
  inputsCount: number;
  sumOfInputsSatoshis: number;
  ops: string[];
  outputsCount: number;
  sumOfOutputsSatoshis: number;
  partialInputs: boolean;
  inputs: BitailsInput[];
  partialOutputs: boolean;
  outputs: BitailsOutput[];
  fee: number;
  notices: string[];
  tags: string[];
}

export interface BitailsInput {
  index: number;
  source: BitailsSource;
  partialScriptSig: boolean;
  scriptSig: string;
  sequence: number;
}

export interface BitailsSource {
  txid: string;
  index: number;
  script: string;
  scripthash: string;
  coinbase: string;
  satoshis: number;
}

export interface BitailsOutput {
  index: number;
  satoshis: number;
  script: string;
  scriptSize: number;
  partialScript: boolean;
  scriptHash: string;
  reqSigs: number;
  type: OutputType;
  spent: boolean;
  spentIn: BitailsSpentIn;
  tags: string[];
}

export interface BitailsSpentIn {
  txid: string;
  inputIndex: number;
}

export interface BitailsRawBlockHeader {
  header: string;
}

export interface BitailsBroadcastTransaction {
  txid: string;
  error?: {
    code: number;
    message: string;
  };
}

export interface BitailsSocketBlockHeader {
  hash: string;
  confirmations: number;
  size: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  numTx: number;
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash: string;
  nextblockhash: string;
}

export interface BitailsSocketLockSpentScripthash {
  type: 'spent' | 'lock';
  txid: string;
  scripthash: string;
}

export interface BitailsOutputStatus {
  txid: string;
  index: number;
  blockheight?: number;
  spent?: boolean;
  status: 'exists' | 'mempool' | 'unknown';
  description:
    | 'Generated in mempool'
    | 'Generated in mempool and spent'
    | 'Mined'
    | 'Mined but spent in mempool'
    | 'Unknown';
}

export interface BitailsNetworkInfo {
  blocks: number;
  bestBlockhash: string;
  chainwork: string;
  difficulty: number;
  mediantime: number;
  hashRate: number;
}

export interface BitailsScripthashBalance {
  scripthash: string;
  confirmed: number;
  unconfirmed: number;
  summary: number;
  count: number;
}

export interface BitailsScripthashUnspent {
  address: string;
  scripthash: string;
  unspent: {
    txid: string;
    vout: number;
    satoshis: number;
    time: number;
    blockheight: number;
    confirmations: number;
  }[];
}

export interface BitailsTransactionMerkleTSC {
  index: number;
  txOrId: string;
  target: string;
  nodes: string[];
}
