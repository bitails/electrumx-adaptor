export const ELECTRUMX_METHODS = {
  SERVER_PING: 'server.ping',
  SERVER_VERSION: 'server.version',
  SERVER_BANNER: 'server.banner',
  SERVER_DONATION_ADDRESS: 'server.donation_address',
  SERVER_PEERS_SUBSCRIBE: 'server.peers.subscribe',

  BLOCKCHAIN_HEADERS_SUBSCRIBE: 'blockchain.headers.subscribe',
  BLOCKCHAIN_BLOCK_HEADER: 'blockchain.block.header',

  BLOCKCHAIN_TRANSACTION_BROADCAST: 'blockchain.transaction.broadcast',
  BLOCKCHAIN_TRANSACTION_GET_MERKLE: 'blockchain.transaction.get_merkle',
  BLOCKCHAIN_TRANSACTION_GET: 'blockchain.transaction.get',

  BLOCKCHAIN_ESTIMATE_FEE: 'blockchain.estimatefee',
  BLOCKCHAIN_RELY_FEE: 'blockchain.relayfee',

  BLOCKCHAIN_SCRIPTHASH_SUBSCRIBE: 'blockchain.scripthash.subscribe',
  BLOCKCHAIN_SCRIPTHASH_UNSUBSCRIBE: 'blockchain.scripthash.unsubscribe',
  BLOCKCHAIN_SCRIPTHASH_GET_HISTORY: 'blockchain.scripthash.get_history',
  BLOCKCHAIN_SCRIPTHASH_GET_MEMPOOL: 'blockchain.scripthash.get_mempool',
  BLOCKCHAIN_SCRIPTHASH_GET_BALANCE: 'blockchain.scripthash.get_balance',
  BLOCKCHAIN_SCRIPTHASH_LIST_UNSPENT: 'blockchain.scripthash.listunspent',
};
