import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitailsSocket } from './bitails.socket';
import { BitailsSocketConfigService } from './bitails.socket.config.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BitailsSocketConfigService, BitailsSocket],
  exports: [BitailsSocketConfigService, BitailsSocket],
})
export class BitailsSocketModule {}
