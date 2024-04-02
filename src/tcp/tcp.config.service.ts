import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BitcoinNetwork } from 'types/bitcoin';

@Injectable()
export class TcpConfigService {
  constructor(private readonly configService: ConfigService) {}

  get NETWORK(): BitcoinNetwork {
    return this.configService.get<string>('NETWORK') as BitcoinNetwork;
  }

  get DONATION_ADDRESS(): string {
    return this.configService.get<string>('DONATION_ADDRESS');
  }

  get HOST(): string {
    return this.configService.get<string>('TCP_HOST');
  }

  get PORT(): number {
    return +this.configService.get<string>('TCP_PORT');
  }
}
