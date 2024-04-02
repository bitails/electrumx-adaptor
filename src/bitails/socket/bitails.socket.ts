import * as io from 'socket.io-client';

import { Injectable } from '@nestjs/common';
import { BitailsSocketConfigService } from './bitails.socket.config.service';

@Injectable()
export class BitailsSocket {
  constructor(private readonly configService: BitailsSocketConfigService) {}

  getSocket() {
    const socket = io.connect(`${this.configService.API_ENDPOINT}/global`, {
      transports: ['websocket'],
    });
    socket.connect();
    return socket;
  }
}
