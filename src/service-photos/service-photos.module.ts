import { Module } from '@nestjs/common';
import { ServicePhotosService } from './service-photos.service';
import { ServicePhotosController } from './service-photos.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [ServicePhotosService],
  controllers: [ServicePhotosController],
})
export class ServicePhotosModule {}
