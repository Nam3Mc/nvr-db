import { Module } from '@nestjs/common';
import { ServicePhotosService } from './service-photos.service';
import { ServicePhotosController } from './service-photos.controller';

@Module({
  providers: [ServicePhotosService],
  controllers: [ServicePhotosController]
})
export class ServicePhotosModule {}
