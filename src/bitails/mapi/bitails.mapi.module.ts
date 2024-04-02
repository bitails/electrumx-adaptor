import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitailsMapiConfigService } from './bitails.mapi.config.service';
import { BitailsMapiService } from './bitails.mapi.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BitailsMapiConfigService, BitailsMapiService],
  exports: [BitailsMapiConfigService, BitailsMapiService],
})
export class BitailsMapiModule {}
