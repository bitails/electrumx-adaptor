import * as crypto from 'crypto';

export class MerkleTree {
  private static createHash(buffer: Buffer): Buffer {
    return crypto.createHash('sha256').update(buffer).digest();
  }

  static calculate(hashes: Buffer[]) {
    const merkles: Buffer[][] = [];
    let repeat = true;
    let tempHashes = [...hashes];
    do {
      if (tempHashes.length === 1) {
        repeat = false;
      } else {
        if (tempHashes.length % 2 !== 0) {
          tempHashes.push(Buffer.from(tempHashes[tempHashes.length - 1]));
        }
        const newLayer = [];
        const reverseLeaves = tempHashes.map((hash) => hash.reverse());
        for (let i = 0; i < reverseLeaves.length; i += 2) {
          const left = reverseLeaves[i];
          const right = reverseLeaves[i + 1];
          const newHash = MerkleTree.createHash(
            MerkleTree.createHash(Buffer.concat([left, right])),
          ).reverse();
          newLayer.push(newHash);
        }
        if (tempHashes.length > 2 && newLayer.length % 2 !== 0) {
          newLayer.push(Buffer.from(newLayer[newLayer.length - 1]));
        }
        tempHashes = newLayer;
        merkles.push([...newLayer.map((b) => Buffer.from(b))]);
      }
    } while (repeat);

    return merkles;
  }

  static calculateNumeralMerklePath(
    blockTransactionsCount: number,
    inblockIndex: number,
  ): { index: number; pos: 'L' | 'R' }[] {
    const indexes: { branch: number; index: number; pos: 'L' | 'R' }[] = [];
    const branchesCount = Math.log2(blockTransactionsCount) + 1;
    if (inblockIndex % 2 === 0) {
      indexes.push({
        branch: 0,
        index:
          inblockIndex + 1 > blockTransactionsCount - 1
            ? inblockIndex
            : inblockIndex + 1,
        pos: 'R',
      });
    } else {
      indexes.push({ branch: 0, index: inblockIndex - 1, pos: 'L' });
    }
    let position = inblockIndex;
    for (let i = 0; i < branchesCount - 1; i++) {
      const make = Math.floor(position / 2);
      const index = make % 2 === 0 ? make + 1 : make - 1;
      const pos = index > make ? 'R' : 'L';
      indexes.push({ branch: i + 1, index, pos });
      position = index;
    }

    return indexes;
  }
}
