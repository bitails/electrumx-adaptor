export interface BitailsMapiFeeQuote {
  fees: {
    feeType: 'standard' | 'data';
    miningFee: {
      satoshis: number;
      bytes: number;
    };
    relayFee: {
      satoshis: number;
      bytes: number;
    };
  }[];
}
