import * as async from 'async';
import * as net from 'net';

import {
  BitailsSocketBlockHeader,
  BitailsSocketLockSpentScripthash,
} from 'types/bitails';
import {
  ElectrumXHistory,
  ElectrumXTransaction,
  ElectrumXTransactionMerkle,
} from 'types/electrumx';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { BitailsApiService } from 'src/bitails/api/bitails.api.service';
import { BitailsMapiService } from 'src/bitails/mapi/bitails.mapi.service';
import { BitailsSocket } from 'src/bitails/socket/bitails.socket';
import { Convertor } from 'src/libs/convertor';
import {
  ScripthashStatusItem,
  computeScripthashStatus,
} from 'src/libs/scripthash-status';
import { ELECTRUMX_METHODS } from './tcp.method.const';
import { Socket } from 'socket.io-client';
import { TcpConfigService } from './tcp.config.service';

/** Page size for Bitails scripthash history fetches (subscribe + get_history). */
const SCRIPTHASH_HISTORY_PAGE_SIZE = 500;

@Injectable()
export class TcpService implements OnModuleInit {
  constructor(
    private readonly configService: TcpConfigService,
    private readonly bitailsApiService: BitailsApiService,
    private readonly bitailsGlobalSocket: BitailsSocket,
    private readonly bitailsMapiService: BitailsMapiService,
  ) {}

  onModuleInit() {
    this.startTcpServer();
  }

  private async handleMessage(
    request: { id: number; method: string; params: any[] },
    tcpSocket: net.Socket,
    bSocket: Socket,
  ): Promise<void> {
    let result: any;
    switch (request.method) {
      case ELECTRUMX_METHODS.BLOCKCHAIN_HEADERS_SUBSCRIBE:
        bSocket.on('block', async (block: BitailsSocketBlockHeader) => {
          const blockHeader = await this.bitailsApiService.getBlockHeader(
            block.height,
          );
          tcpSocket.write(
            JSON.stringify({
              jsonrpc: '2.0',
              method: ELECTRUMX_METHODS.BLOCKCHAIN_HEADERS_SUBSCRIBE,
              params: [
                {
                  hex: blockHeader.header,
                  height: block.height,
                },
              ],
            }) + '\n',
          );
        });
        const networkInfo = await this.bitailsApiService.getNetworkInfo();
        const lastestBlockHeader = await this.bitailsApiService.getBlockHeader(
          networkInfo.blocks,
        );
        result = {
          hex: lastestBlockHeader.header,
          height: networkInfo.blocks,
        };
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_SUBSCRIBE: {
        const scripthash = request.params[0] as string;
        const notifyStatus = async (data: BitailsSocketLockSpentScripthash) => {
          try {
            const status = await this.scriptHashGetStatus(data.scripthash);
            tcpSocket.write(
              JSON.stringify({
                jsonrpc: '2.0',
                method: ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_SUBSCRIBE,
                params: [data.scripthash, status],
              }) + '\n',
            );
          } catch (error) {
            Logger.error(
              `Failed to push scripthash status for ${data.scripthash}`,
              error,
            );
          }
        };
        bSocket.on(`lock-scripthash-${scripthash}`, notifyStatus);
        bSocket.on(`spent-scripthash-${scripthash}`, notifyStatus);
        result = await this.scriptHashGetStatus(scripthash);
        break;
      }
      case ELECTRUMX_METHODS.SERVER_PING:
        result = null;
        break;
      case ELECTRUMX_METHODS.SERVER_VERSION:
        result = ['ElectrumX 1.20.2', '1.4'];
        break;
      case ELECTRUMX_METHODS.SERVER_BANNER:
        result = 'Welcome to Bitails ElectrumX adapter';
        break;
      case ELECTRUMX_METHODS.SERVER_DONATION_ADDRESS:
        result = this.configService.DONATION_ADDRESS;
        break;
      case ELECTRUMX_METHODS.SERVER_PEERS_SUBSCRIBE:
        result = [];
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_UNSUBSCRIBE:
        bSocket.removeListener(`lock-scripthash-${request.params[0]}`);
        bSocket.removeListener(`spent-scripthash-${request.params[0]}`);

        result = true;
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_GET_HISTORY:
        result = await this.scriptHashGetHistory(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_GET_MEMPOOL:
        result = await this.scriptHashGetMempool(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_GET_BALANCE:
        result = await this.scriptHashGetBalance(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_SCRIPTHASH_LIST_UNSPENT:
        result = await this.scriptHashListUnspent(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_BLOCK_HEADER:
        result = await this.blockGetHeader(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_TRANSACTION_BROADCAST:
        result = await this.transactionBroadcast(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_TRANSACTION_GET_MERKLE:
        result = await this.transactionGetMerkle(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_TRANSACTION_GET:
        result = await this.transactionGet(request.params);
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_ESTIMATE_FEE:
        result = await this.estimateFee();
        break;
      case ELECTRUMX_METHODS.BLOCKCHAIN_RELY_FEE:
        result = await this.relayFee();
        break;
      default:
        return;
    }

    tcpSocket.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id: request.id,
        result,
      }) + '\n',
    );
  }
  private startTcpServer() {
    const tcpServer = net.createServer((socket) => {
      const bSocket = this.bitailsGlobalSocket.getSocket();
      let buffer = Buffer.alloc(0);
      socket.on('data', async (data) => {
        buffer = Buffer.concat([buffer, data]);
        let newlineIndex: number;
        const requests: { method: string; params: any[]; id: number }[] = [];
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const rawMessage = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (rawMessage.length > 0) {
            try {
              const messageString = rawMessage.toString();
              const request: { method: string; params: any[]; id: number } =
                JSON.parse(messageString);
              Logger.debug(messageString);
              requests.push(request);
            } catch (error) {
              Logger.error(
                'Failed to parse JSON:',
                socket.remoteAddress,
                rawMessage.toString('hex'),
              );
              // Optionally, send an error response to the client
            }
          }
        }
        if (requests.length > 0) {
          await async.each(requests, async (request) => {
            return this.handleMessage(request, socket, bSocket);
          });
        }
      });

      socket.on('error', (error) => {
        Logger.error('Socket error:', error);
      });

      socket.on('end', () => {
        bSocket.close();
        Logger.log('Client disconnected.');
      });
    });

    tcpServer.listen(this.configService.PORT, this.configService.HOST, () => {
      Logger.log(
        `TCP Server listening on ${this.configService.HOST}:${this.configService.PORT}`,
      );
    });
  }

  /**
   * Electrum 1.4 history for a scripthash: confirmed (blockchain order) then
   * mempool (height 0 / -1). Uses whatever history Bitails still has (pruned).
   */
  private async scriptHashGetHistoryItems(
    scripthash: string,
  ): Promise<ScripthashStatusItem[]> {
    const raw: { txid: string; blockheight: number }[] = [];
    let pgkey: string | undefined;

    while (true) {
      const page = await this.bitailsApiService.scripthashGetHistory(
        scripthash,
        SCRIPTHASH_HISTORY_PAGE_SIZE,
        pgkey,
      );
      raw.push(...page.history);
      if (!page.pgKey || page.history.length === 0) {
        break;
      }
      pgkey = page.pgKey;
    }

    // Bitails returns newest-first; reverse so same-height ties stay chronological.
    raw.reverse();

    const confirmed = raw
      .filter((item) => item.blockheight > 0)
      .map((item) => ({
        tx_hash: item.txid,
        height: item.blockheight,
      }))
      .sort((a, b) => a.height - b.height);

    const mempoolTxIds = raw
      .filter((item) => item.blockheight <= 0)
      .map((item) => item.txid);
    const mempool = await this.resolveMempoolHeights(mempoolTxIds);

    return [...confirmed, ...mempool];
  }

  private async resolveMempoolHeights(
    txsIds: string[],
  ): Promise<(ScripthashStatusItem & { fee?: number })[]> {
    if (txsIds.length === 0) {
      return [];
    }

    const txsResult = await this.bitailsApiService.getTransactionsMulti(txsIds);
    const matchedOutputs = txsResult
      .map((tx) => tx.inputs.map((inp) => ({ txid: tx.txid, input: inp })))
      .flat()
      .map((inp) => ({
        spentInTxId: inp.txid,
        txid: inp.input.source.txid,
        index: inp.input.source.index,
      }));
    const outputsStatusResults =
      await this.bitailsApiService.getBitailsOutputsStatusMulti(matchedOutputs);
    const outputsStatusMap = new Map<string, string>();
    outputsStatusResults.forEach((osr) => {
      outputsStatusMap.set(`${osr.txid}_${osr.index}`, osr.status);
    });

    return txsResult.map((tx) => ({
      tx_hash: tx.txid,
      height:
        tx.inputs.filter(
          (inp) =>
            outputsStatusMap.get(`${inp.source.txid}_${inp.source.index}`) ===
            'mempool',
        ).length === 0
          ? 0
          : -1,
      fee: tx.fee,
    }));
  }

  private async scriptHashGetStatus(
    scripthash: string,
  ): Promise<string | null> {
    const history = await this.scriptHashGetHistoryItems(scripthash);
    return computeScripthashStatus(history);
  }

  private async scriptHashGetHistory(
    params: any[],
  ): Promise<ElectrumXHistory[]> {
    return this.scriptHashGetHistoryItems(params[0]);
  }

  private async scriptHashGetMempool(params: any[]) {
    const txsIds: string[] = [];
    let pgkey: string | undefined;
    while (true) {
      const result = await this.bitailsApiService.scripthashGetHistory(
        params[0],
        200,
        pgkey,
      );

      const unconfirmedTxsIds = result.history
        .filter((history) => history.blockheight <= 0)
        .map((history) => history.txid);
      txsIds.push(...unconfirmedTxsIds);
      if (result.history.length > unconfirmedTxsIds.length || !result.pgKey) {
        break;
      }
      pgkey = result.pgKey;
    }

    return this.resolveMempoolHeights(txsIds);
  }

  private async scriptHashGetBalance(params: any[]) {
    const result = await this.bitailsApiService.scripthashBalance(params[0]);

    return {
      confirmed: result.confirmed,
      unconfirmed: result.unconfirmed,
    };
  }

  private async scriptHashListUnspent(params: any[]) {
    const result = await this.bitailsApiService.scripthashListUnspent(
      params[0],
    );

    return result.unspent.map((utxo) => ({
      tx_pos: utxo.vout,
      value: utxo.satoshis,
      tx_hash: utxo.txid,
      height: utxo.blockheight,
    }));
  }

  private async blockGetHeader(params: any[]) {
    const header = await this.bitailsApiService.getBlockHeader(params[0]);
    // if (!params[1]) {
    return { header: header.header };
    // }

    // throw new Error('NOT_IMPLEMENTED_YET');
  }

  private async transactionBroadcast(params: any[]) {
    const result = await this.bitailsApiService.broadcastTransaction(params[0]);
    if (result.txid) {
      return result.txid;
    }

    return result.error?.message;
  }

  private async transactionGetMerkle(
    params: any[],
  ): Promise<ElectrumXTransactionMerkle> {
    const result = await this.bitailsApiService.transactionMerkle(params[0]);
    const transaction = await this.bitailsApiService.getTransaction(params[0]);
    return {
      merkle: result.nodes,
      block_height: transaction.blockheight,
      pos: result.index,
    };
  }

  private async transactionGet(
    params: any[],
  ): Promise<ElectrumXTransaction | string> {
    const raw = await this.bitailsApiService.getTransactionRaw(params[0]);

    if (!params[1]) {
      return raw.toString('hex');
    }
    const result = await this.bitailsApiService.getTransaction(params[0]);

    return {
      blockhash: result.blockhash,
      blocktime: result.blocktime,
      confirmations: result.confirmations,
      hash: result.txid,
      hex: raw.toString('hex'),
      locktime: result.locktime,
      size: result.size,
      time: result.time,
      txid: result.txid,
      version: null,
      vin: result.inputs.map((inp) =>
        Convertor.bitailsInputIntoElectrumXInput(inp),
      ),
      vout: result.outputs.map((out) =>
        Convertor.bitailsOutputIntoElectrumXOutput(
          out,
          this.configService.NETWORK,
        ),
      ),
    };
  }

  private async estimateFee() {
    const feeQuote = await this.bitailsMapiService.feeQuote();

    return (
      feeQuote.fees.find((f) => f.feeType === 'standard')?.miningFee.satoshis /
        100000000 || -1
    );
  }

  private async relayFee() {
    const feeQuote = await this.bitailsMapiService.feeQuote();

    return (
      feeQuote.fees.find((f) => f.feeType === 'standard')?.relayFee.satoshis /
        100000000 || -1
    );
  }
}
