import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServicePestDto } from './dto/create-service-pest.dto';

@Injectable()
export class ServicePestsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(serviceId: string, createPestServiceDto: CreateServicePestDto) {
        return this.prisma.servicePest.create({
            data: {
                type: createPestServiceDto.type,
                infestationLevel: createPestServiceDto.infestationLevel,
                serviceId: serviceId,
            },
            select: {
                id: true,
                type: true,
                infestationLevel: true,
            }
        })
    }

 }
