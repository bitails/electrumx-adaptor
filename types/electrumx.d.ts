export interface ElectrumXTransaction {
  blockhash: string;
  blocktime: number;
  confirmations: number;
  hash: string;
  hex: string;
  locktime: number;
  size: number;
  time: number;
  txid: string;
  version: number;
  vin: {
    scriptSig: {
      asm: string;
      hex: string;
    };
    sequence: number;
    txid: string;
    vout: number;
  }[];
  vout: {
    n: number;
    scriptPubKey: {
      addresses: string[];
      asm: string;
      hex: string;
      reqSigs: number;
      type: string;
    };
    value: number;
  }[];
}

export interface ElectrumXHistory {
  height: number;
  tx_hash: string;
}

export interface ElectrumXScripthashUnconfirmedTransaction {
  height: number;
  tx_hash: string;
}

export interface ElectrumXScripthashBalance {
  confirmed: number;
  unconfirmed: number;
}

export interface ElectrumXScripthashUnspent {
  tx_pos: number;
  value: number;
  tx_hash: string;
  height: number;
}

export interface ElectrumXTransactionMerkle {
  merkle: string[];
  block_height: number;
  pos: number;
}
