import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BitailsMapiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get ENDPOINT(): string {
    return this.configService.get<string>('BITAILS_MAPI_ENDPOINT');
  }
}
