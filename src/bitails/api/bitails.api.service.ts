import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import {
  BitailsBroadcastTransaction,
  BitailsNetworkInfo,
  BitailsOutputStatus,
  BitailsRawBlockHeader,
  BitailsScripthashBalance,
  BitailsScripthashHistory,
  BitailsScripthashUnspent,
  BitailsTransaction,
  BitailsTransactionMerkleTSC,
} from 'types/bitails';

import { BitailsApiConfigService } from './bitails.api.config.service';

@Injectable()
export class BitailsApiService {
  constructor(private readonly configService: BitailsApiConfigService) {}

  async scripthashGetHistory(
    scripthash: string,
    limit: number,
    pgkey?: string,
  ) {
    try {
      const result = await axios.get<
        any,
        AxiosResponse<BitailsScripthashHistory>
      >(
        `${this.configService.API_ENDPOINT}/scripthash/${scripthash}/history?limit=${limit}${pgkey ? `&pgkey=${pgkey}` : ''}`,
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async getTransactionsMulti(txsIds: string[]): Promise<BitailsTransaction[]> {
    try {
      const txsResult = await axios.post<
        any,
        AxiosResponse<BitailsTransaction[]>
      >(
        `${this.configService.API_ENDPOINT}/tx/multi`,
        { txsIds },
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (txsResult.status !== 201) {
        throw new HttpException(txsResult.statusText, txsResult.status);
      }

      return txsResult.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async getBitailsOutputsStatusMulti(
    outputs: { txid: string; index: number }[],
  ) {
    try {
      const outputsStatusResults = await axios.post<
        any,
        AxiosResponse<BitailsOutputStatus[]>
      >(
        `${this.configService.API_ENDPOINT}/tx/output/status/multi`,
        {
          outputs,
        },
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (outputsStatusResults.status !== 201) {
        throw new HttpException(
          outputsStatusResults.statusText,
          outputsStatusResults.status,
        );
      }

      return outputsStatusResults.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async scripthashBalance(scripthash: string) {
    try {
      const result = await axios.get<
        any,
        AxiosResponse<BitailsScripthashBalance>
      >(`${this.configService.API_ENDPOINT}/scripthash/${scripthash}/balance`, {
        headers: { apiKey: this.configService.API_KEY },
      });
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async scripthashListUnspent(scripthash: string) {
    try {
      const result = await axios.get<
        any,
        AxiosResponse<BitailsScripthashUnspent>
      >(
        `${this.configService.API_ENDPOINT}/scripthash/${scripthash}/unspent?from=0&limit=10000`,
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async transactionMerkle(txid: string) {
    try {
      const result = await axios.get<
        any,
        AxiosResponse<BitailsTransactionMerkleTSC>
      >(`${this.configService.API_ENDPOINT}/tx/${txid}/proof/tsc`, {
        headers: { apiKey: this.configService.API_KEY },
      });
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async getTransaction(txid: string) {
    try {
      const result = await axios.get<any, AxiosResponse<BitailsTransaction>>(
        `${this.configService.API_ENDPOINT}/tx/${txid}`,
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async getTransactionRaw(txid: string): Promise<Buffer> {
    try {
      const result = await axios.get<any, AxiosResponse<Buffer>>(
        `${this.configService.API_ENDPOINT}/download/tx/${txid}`,
        {
          responseType: 'arraybuffer',

          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async getNetworkInfo() {
    try {
      const result = await axios.get<any, AxiosResponse<BitailsNetworkInfo>>(
        `${this.configService.API_ENDPOINT}/network/info`,
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async getBlockHeader(height: number) {
    try {
      const result = await axios.get<any, AxiosResponse<BitailsRawBlockHeader>>(
        `${this.configService.API_ENDPOINT}/block/header/height/${height}/raw`,
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }

  async broadcastTransaction(raw: string) {
    try {
      const result = await axios.post<
        any,
        AxiosResponse<BitailsBroadcastTransaction>
      >(
        `${this.configService.API_ENDPOINT}/tx/broadcast`,
        { raw },
        {
          headers: { apiKey: this.configService.API_KEY },
        },
      );
      if (result.status !== 201) {
        throw new HttpException(result.statusText, result.status);
      }

      return result.data;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }
}
