import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

const serviceLength =  8100000

@Injectable()
export class ServicesService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(createServiceDto: CreateServiceDto) {
        const startTime = new Date(createServiceDto.scheduledAt)
        const endTime = +startTime + serviceLength;
        const slackStartedTime = +startTime - serviceLength

        // const service = await this.prisma.service.findMany({
            // where: {
                // startedAt: {
                    // 
                // }
            // }
        // })

        console.log(endTime)





        // return this.prisma.service.create({
            // data: {
                // clientId: createServiceDto.clientId,
                // technicians: {
                    // connect: createServiceDto.technicianIds.map(technicianId => ({
                        // id: technicianId
                    // })),
                // },
                // scheduledAt: new Date(createServiceDto.scheduledAt),
                // observations: createServiceDto.observations,
            // }
        // })
    }
}
