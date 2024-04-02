import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

import { BitailsMapiFeeQuote } from 'types/bitails.mapi';
import { BitailsMapiConfigService } from './bitails.mapi.config.service';

@Injectable()
export class BitailsMapiService {
  constructor(private readonly configService: BitailsMapiConfigService) {}

  async feeQuote(): Promise<BitailsMapiFeeQuote> {
    try {
      const result = await axios.get<any, AxiosResponse<{ payload: string }>>(
        `${this.configService.ENDPOINT}/mapi/feeQuote`,
      );
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
