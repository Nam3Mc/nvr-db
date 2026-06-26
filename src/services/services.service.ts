import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { CompleteServiceDto } from './dto/complete-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async checkTechniciansAvailabilityWithMargin(technicianIds: string[], requestedDate:Date) {
        const MARGIN_MS = (2 * 60 + 15) * 60 * 1000;
        const minAllowedStart = new Date(requestedDate.getTime() - MARGIN_MS);
        const maxAllowedStart = new Date(requestedDate.getTime() + MARGIN_MS);

        return this.prisma.service.findMany({
            where: {
                technicians: {
                    some: {
                        id: { in: technicianIds }
                    }
                },
                status: {
                    in: ['SCHEDULED', 'COMPLETED']
                },
                scheduledAt: {
                    gte: minAllowedStart,
                    lte: maxAllowedStart
                }
            },
            select: {
                id: true,
                serviceNumber: true,
                scheduledAt:true,
                technicians: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
    }

    async create(createServiceDto: CreateServiceDto) {
        const { technicianIds, scheduledAt } = createServiceDto;
        const requestedDate = new Date(scheduledAt);
        const COLOMBIA_OFFSET = 5 * 60 * 60 * 1000;
        const now = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' })
        );
        if ( requestedDate.getTime() <= now.getTime() - COLOMBIA_OFFSET ) {
            throw new  Error(
                'A service can not be scheduled in the pass'
            );
        }

        const conflictingServices = await this.checkTechniciansAvailabilityWithMargin(
            technicianIds,
            requestedDate
        );

        if (conflictingServices.length > 0) {
            const conflicDetails = conflictingServices.map( service => 
                `N° ${service.serviceNumber} at ${service.scheduledAt.toISOString().substring(11, 16)}`
            ).join(', ');

            throw new Error(
                `Time conlflict. Must be an space of 2h 15m of difference between Services.
                Closer scheduled service found: ${conflicDetails}`
            );
        }

        return this.prisma.service.create({
            data: {
                scheduledAt: requestedDate,
                notes: createServiceDto.notes,
                servicePrice: createServiceDto.servicePrice,
                clientId: createServiceDto.clientId,
                technicians: {
                    connect: technicianIds.map(id => ({ id }))
                },
            },
            select: {
                id: true,
                serviceNumber: true,
                status: true,
                scheduledAt: true,
                notes: true,
                servicePrice: true,
                clientId: true,
                client: {
                    select: {
                        companyName: true,
                        NIT: true,
                        address: true,
                        phone: true,
                    }
                },
                technicians: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName:true,
                        phone: true,
                    }
                },
                createdAt: true,
            }
        })
    }

    async allServices() {
        return this.prisma.service.findMany();
    }

    async completeService(serviceId: string, conpleteServiceDto: CompleteServiceDto) {



    }

}
