import * as crypto from 'crypto';

export interface ScripthashStatusItem {
  tx_hash: string;
  height: number;
}

/**
 * Electrum protocol ≤ 1.4 script-hash status.
 *
 * status = sha256( concat("tx_hash:height:" ...) ) as hex, or null if empty.
 * Confirmed txs first (increasing height; input order preserved for ties),
 * then mempool txs ordered by (-height, tx_hash).
 */
export function computeScripthashStatus(
  history: ScripthashStatusItem[],
): string | null {
  if (!history.length) {
    return null;
  }

  const confirmed = history
    .filter((item) => item.height > 0)
    .sort((a, b) => a.height - b.height);

  const mempool = history
    .filter((item) => item.height <= 0)
    .map((item) => ({
      tx_hash: item.tx_hash,
      height: item.height < 0 ? -1 : 0,
    }))
    .sort((a, b) => {
      if (a.height !== b.height) {
        // height 0 before height -1
        return b.height - a.height;
      }
      if (a.tx_hash < b.tx_hash) {
        return -1;
      }
      if (a.tx_hash > b.tx_hash) {
        return 1;
      }
      return 0;
    });

  let statusString = '';
  for (const item of confirmed) {
    statusString += `${item.tx_hash}:${item.height}:`;
  }
  for (const item of mempool) {
    statusString += `${item.tx_hash}:${item.height}:`;
  }

  return crypto.createHash('sha256').update(statusString, 'utf8').digest('hex');
}
