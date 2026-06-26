import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

const itemSelect = {
    id: true,
    name: true,
    lot: true,
    provider: true,
    serial: true,
    registrationNumber: true,
    expirationDate: true,
    measurementUnit: true,
    quantity: true,
    price: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};

@Injectable()
export class ItemsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createItemDto: CreateItemDto) {
        return this.prisma.item.create({
            data: {
                name: createItemDto.name,
                lot: createItemDto.lot,
                provider: createItemDto.provider,
                serial: createItemDto.serial,
                registrationNumber: createItemDto.registrationNumber,
                expirationDate: createItemDto.expirationDate
                    ? new Date(createItemDto.expirationDate)
                    : undefined,
                measurementUnit: createItemDto.measurementUnit,
                quantity: createItemDto.quantity,
                price: createItemDto.price,
            },
            select: itemSelect,
        });
    }

    async findAll() {
        return this.prisma.item.findMany({
            select: itemSelect,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findActive() {
        return this.prisma.item.findMany({
            where: {
                isActive: true,
            },
            select: itemSelect,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const item = await this.prisma.item.findUnique({
            where: { id },
            select: itemSelect,
        });

        if (!item) {
            throw new NotFoundException('Item not found.');
        }

        return item;
    }

    async update(id: string, updateItemDto: UpdateItemDto) {
        const item = await this.prisma.item.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException('Item not found.');
        }

        if (Object.keys(updateItemDto).length === 0) {
            throw new BadRequestException('At least one field must be provided.');
        }

        return this.prisma.item.update({
            where: { id },
            data: {
                name: updateItemDto.name,
                lot: updateItemDto.lot,
                provider: updateItemDto.provider,
                serial: updateItemDto.serial,
                registrationNumber: updateItemDto.registrationNumber,
                expirationDate: updateItemDto.expirationDate
                    ? new Date(updateItemDto.expirationDate)
                    : undefined,
                measurementUnit: updateItemDto.measurementUnit,
                quantity: updateItemDto.quantity,
                price: updateItemDto.price,
            },
            select: itemSelect,
        });
    }

    async deactivate(id: string) {
        const item = await this.prisma.item.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException('Item not found.');
        }

        if (!item.isActive) {
            throw new BadRequestException('Item is already inactive.');
        }

        return this.prisma.item.update({
            where: { id },
            data: {
                isActive: false,
            },
            select: itemSelect,
        });
    }

    async activate(id: string) {
        const item = await this.prisma.item.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException('Item not found.');
        }

        if (item.isActive) {
            throw new BadRequestException('Item is already active.');
        }

        return this.prisma.item.update({
            where: { id },
            data: {
                isActive: true,
            },
            select: itemSelect,
        });
    }
}