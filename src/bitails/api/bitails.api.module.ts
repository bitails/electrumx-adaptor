import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitailsApiConfigService } from './bitails.api.config.service';
import { BitailsApiService } from './bitails.api.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BitailsApiConfigService, BitailsApiService],
  exports: [BitailsApiConfigService, BitailsApiService],
})
export class BitailsApiModule {}
