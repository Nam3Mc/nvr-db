import { Module } from '@nestjs/common';
import { ServiceItemsService } from './service-items.service';
import { ServiceItemsController } from './service-items.controller';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [ItemsModule],
  providers: [ServiceItemsService],
  controllers: [ServiceItemsController],
})
export class ServiceItemsModule {}
