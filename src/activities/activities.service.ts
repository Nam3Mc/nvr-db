import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
    constructor(
       private readonly prisma: PrismaService 
    ) {}

    async create(serviceId: string, createActivityDto: CreateActivityDto) {
        return this.prisma.activity.create({
            data: {
                type: createActivityDto.type,
                tankCapacityLiters: createActivityDto.tankCapacityLiters,
                tankStructureType: createActivityDto.tankStructureType,
                tankLocation: createActivityDto.tankLocation,
                notes: createActivityDto.notes,
                serviceId: serviceId,
            },
            select: {
                id: true,
                type: true,
                tankCapacityLiters: true,
                tankStructureType: true,
                tankLocation: true,
            }
        })
    }
}
