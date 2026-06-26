import { Module } from '@nestjs/common';
import { ServicePestsController } from './service-pests.controller';
import { ServicePestsService } from './service-pests.service';

@Module({
  controllers: [ServicePestsController],
  providers: [ServicePestsService],
})
export class ServicePestsModule {}
