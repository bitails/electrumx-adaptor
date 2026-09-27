import { computeScripthashStatus } from './scripthash-status';

describe('computeScripthashStatus', () => {
  it('returns null for empty history', () => {
    expect(computeScripthashStatus([])).toBeNull();
  });

  it('matches the Electrum protocol status example', () => {
    // From electrum-protocol docs (protocol-basics Status Example)
    const history = [
      {
        tx_hash:
          'a6c9c361bd0bc536d6a22648efbf8f9b200e425ef6c3a7a9669dc444c532a347',
        height: 2472,
      },
      {
        tx_hash:
          '9c42f84b2fcdaff676ba25d9d4941741cc0d1a01cce0c23fdc4c0b2afa38431c',
        height: 2473,
      },
      {
        tx_hash:
          '770f2d4371b3fabb902dd9a103e2dd005fcd3971181078fca4a2a1d6ff127b30',
        height: 2473,
      },
      {
        tx_hash:
          '80b19848aed792565ab7c5a79b7c2a00fbf985741579396ebe0ab6098e607311',
        height: 0,
      },
      {
        tx_hash:
          'e02a1dadfa83b996b24175df807b271ea5d02937ef5b35c195fac1e1bdc3198f',
        height: 0,
      },
      {
        tx_hash:
          'bb4c8ab438c13b89ca80d1d5bee25b0b6b7f55673f4d801998ba97db161d9e85',
        height: -1,
      },
    ];

    expect(computeScripthashStatus(history)).toBe(
      '78e96c6562cafa71c115503b9411fdfdc595a45031e2ab76ff75162fe1b0590d',
    );
  });

  it('orders mempool by (-height, tx_hash) regardless of input order', () => {
    // Confirmed same-height order is significant (block position); only shuffle mempool.
    const shuffled = [
      {
        tx_hash:
          'bb4c8ab438c13b89ca80d1d5bee25b0b6b7f55673f4d801998ba97db161d9e85',
        height: -1,
      },
      {
        tx_hash:
          'e02a1dadfa83b996b24175df807b271ea5d02937ef5b35c195fac1e1bdc3198f',
        height: 0,
      },
      {
        tx_hash:
          'a6c9c361bd0bc536d6a22648efbf8f9b200e425ef6c3a7a9669dc444c532a347',
        height: 2472,
      },
      {
        tx_hash:
          '80b19848aed792565ab7c5a79b7c2a00fbf985741579396ebe0ab6098e607311',
        height: 0,
      },
      {
        tx_hash:
          '9c42f84b2fcdaff676ba25d9d4941741cc0d1a01cce0c23fdc4c0b2afa38431c',
        height: 2473,
      },
      {
        tx_hash:
          '770f2d4371b3fabb902dd9a103e2dd005fcd3971181078fca4a2a1d6ff127b30',
        height: 2473,
      },
    ];

    expect(computeScripthashStatus(shuffled)).toBe(
      '78e96c6562cafa71c115503b9411fdfdc595a45031e2ab76ff75162fe1b0590d',
    );
  });
});
