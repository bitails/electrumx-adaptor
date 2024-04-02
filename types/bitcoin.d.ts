export type OutputType =
  | 'pubkeyhash'
  | 'pubkey'
  | 'scripthash'
  | 'nulldata'
  | 'multisig'
  | 'nonstandard';

export type BitcoinNetwork = 'mainnet' | 'testnet' | 'regtest' | 'livenet';
export interface ChainInfo {
  version: number;
  protocolversion: number;
  blocks: number;
  timeoffset: number;
  connections: number;
  proxy: string;
  difficulty: number;
  testnet: boolean;
  stn: boolean;
  relayfee: number;
  errors: string;
  maxblocksize: number;
  maxminedblocksize: number;
  maxstackmemoryusagepolicy: number;
  maxstackmemoryusageconsensus: number;
}

export interface TransactionInput {
  txid: string;
  coinbase?: string;
  vout: number;
  script: string;
  sequence: number;
}

export type OutputType =
  | 'pubkeyhash'
  | 'pubkey'
  | 'scripthash'
  | 'nulldata'
  | 'multisig'
  | 'nonstandard';

export interface TransactionOutput {
  satoshis: number;
  n: number;
  scriptPubKey: {
    script: string;
    reqSigs: number;
    type: OutputType;
  };
  scripthash: string;
}

export interface Transaction {
  txid: string;
  size: number;
  locktime: number;
  time: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  hex: string;
}

export interface TransactionDetails {
  txid?: string;
  inputSatoshis: number;
  outputSatoshis: number;
  fee: number;

  countOfInputs: number;
  countOfOutputs: number;

  size: number;

  ops: number[];

  time: number;
  blockhash: string;
}

export interface BaseBlock {
  hash: string;
  confirmations: number;
  size: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  num_tx: number;
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash: string;
  nextblockhash: string;
}

export interface Block extends BaseBlock {
  tx: string[];
}

export interface GenesisBlock extends BaseBlock {
  tx: Transaction[];
}

// export interface BlockHeader {
//   hash: string;
//   height: number;
// }
