import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BitailsSocketConfigService {
  constructor(private readonly configService: ConfigService) {}

  get API_ENDPOINT(): string {
    return this.configService.get<string>('BITAILS_API_ENDPOINT');
  }

  get API_KEY(): number {
    return +this.configService.get<string>('BITAILS_API_KEY');
  }
}
