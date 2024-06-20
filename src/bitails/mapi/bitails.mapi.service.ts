import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { BitailsMapiConfigService } from './bitails.mapi.config.service';
import { BitailsMapiFeeQuote } from 'types/bitails.mapi';
import axiosRetry from 'axios-retry';

@Injectable()
export class BitailsMapiService {
  private readonly axiosInstance: AxiosInstance;
  constructor(private readonly configService: BitailsMapiConfigService) {
    this.axiosInstance = axios.create();

    axiosRetry(this.axiosInstance, {
      retries: 20,
      retryDelay: (retryCount) => retryCount * 500,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkError(error) ||
          axiosRetry.isRetryableError(error) ||
          error.code === 'ECONNABORTED' ||
          error.message.includes('socket hang up')
        );
      },
    });
  }

  async feeQuote(): Promise<BitailsMapiFeeQuote> {
    try {
      const result = await this.axiosInstance.get<
        any,
        AxiosResponse<{ payload: string }>
      >(`${this.configService.ENDPOINT}/mapi/feeQuote`);
      if (result.status !== 200) {
        throw new HttpException(result.statusText, result.status);
      }

      const parsed = JSON.parse(result.data.payload) as {
        fees: {
          feeType: 'standard' | 'data';
          miningFee: { satoshis: number; bytes: number };
          relayFee: { satoshis: number; bytes: number };
        }[];
      };

      return parsed;
    } catch (err) {
      if (err && err.response) {
        throw new HttpException(err.response.statusText, err.response.status);
      }
      throw err;
    }
  }
}
