import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemsService } from 'src/items/items.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceItemDto } from './dto/create-service-item.dto';
import { Decimal } from '@prisma/client/runtime/index-browser';
import { UpdateItemDto } from 'src/items/dto/update-item.dto';

@Injectable()
export class ServiceItemsService {
    constructor(
       private readonly prisma: PrismaService,
       private readonly itemService: ItemsService,
    ) {}

    async create(serviceId: string, createServiceItemDto: CreateServiceItemDto) {
        const item = await this.itemService.findOne(createServiceItemDto.itemId);
        const dosage = Decimal(createServiceItemDto.dosage)

        if (!item) {
            throw new NotFoundException('Itm not found.')
        }

        if (item.quantity < dosage) {
            throw new BadRequestException('Available quantity of Item is not suficient');
        }

        const itemUsed = this.prisma.serviceItem.create({
            data: {
                itemId: createServiceItemDto.itemId,
                measurementUnit: createServiceItemDto.measurementUnit,
                dosage: dosage,
                applicationMethod: createServiceItemDto.applicationMethod,
                serviceId: serviceId,
            },
            select: {
                id: true,
                dosage: true,
                measurementUnit: true,
                applicationMethod: true,
            }
        })

        if (!itemUsed) {
            throw new BadRequestException('An error ocucur, item used could not beregistered');
        }

        const updatedItemData = new UpdateItemDto();
        updatedItemData.quantity = item.quantity.toNumber() - createServiceItemDto.dosage;
        this.itemService.update(item.id, updatedItemData)

        return itemUsed;
    }
}
