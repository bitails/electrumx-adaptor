import { NestFactory } from '@nestjs/core';
import { TcpModule } from './tcp/tcp.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(TcpModule);
  // const configService = app.get(RpcConfigService);
  // await app.listen(configService.PORT, configService.HOST);
  await app.init();
}
bootstrap();
