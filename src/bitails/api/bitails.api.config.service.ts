import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BitcoinNetwork } from 'types/bitcoin';

@Injectable()
export class BitailsApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get NETWORK(): BitcoinNetwork {
    return this.configService.get<string>('NETWORK') as BitcoinNetwork;
  }

  get API_ENDPOINT(): string {
    return this.configService.get<string>('BITAILS_API_ENDPOINT');
  }

  get API_KEY(): number {
    return +this.configService.get<string>('BITAILS_API_KEY');
  }
}
