import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BitailsApiModule } from 'src/bitails/api/bitails.api.module';
import { BitailsMapiModule } from 'src/bitails/mapi/bitails.mapi.module';
import { BitailsSocketModule } from 'src/bitails/socket/bitails.socket.module';
import { TcpConfigService } from './tcp.config.service';
import { TcpService } from './tcp.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BitailsApiModule,
    BitailsSocketModule,
    BitailsMapiModule,
  ],
  providers: [TcpConfigService, TcpService],
})
export class TcpModule {}
