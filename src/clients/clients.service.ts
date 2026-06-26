import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Prisma } from 'generated/prisma/client';
import { UpdateClientDto } from './dto/update-client.dto';

const clientSelect = {
    id: true,
    companyName: true,
    address: true,
    NIT: true,
    phone: true,
    email: true,
    contactFirstName: true,
    contactLastName: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};

@Injectable()
export class ClientsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(createClientDto: CreateClientDto) {
        const duplicateConditions: Prisma.ClientWhereInput[] = [];
        if (createClientDto.email) {
            duplicateConditions.push({ email: createClientDto.email});
        }
        
        if (createClientDto.NIT) {
            duplicateConditions.push({ NIT: createClientDto.NIT});
        }
            
        if (duplicateConditions.length > 0 ) {
            const existingClient = await this.prisma.client.findFirst({
                where: {
                    OR: duplicateConditions,
                },
            });
            if (existingClient) {
                throw new ConflictException(
                    'A client with this email or NIT already exists.',
                )
            }
        }

        // console.log(duplicateConditions)
        return this.prisma.client.create({
            data: {
                companyName: createClientDto.companyName,
                address: createClientDto.address,
                NIT: createClientDto.NIT,
                phone: createClientDto.phone,
                email: createClientDto.email,
                contactFirstName: createClientDto.contactFirstName,
                contactLastName: createClientDto.contactLastName,
            },
            select: clientSelect,
        });    
    }

    async findAll() {
        return this.prisma.client.findMany({
            select: clientSelect,
            orderBy: {
            companyName: 'desc',
            },
        });
    }

    async findActive() {
        return this.prisma.client.findMany({
            where: {
                isActive: true,
            },
            select: clientSelect,
            orderBy: {
                companyName: 'asc'
            }
        })
    }

    async findOne(id: string) {
        const client = this.prisma.client.findUnique({
            where: {id},
            select: clientSelect,
        });

        if ( !client ) {
            throw new NotFoundException('Client not found')
        }

        return client;
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        const client = this.prisma.client.findUnique({
            where: {id},
        })

        if (!client) {
            throw new NotFoundException('Client not found.');
        }

        if (Object.keys(updateClientDto).length === 0) {
            throw new BadRequestException('At least one field must be provided.');
        }

        const duplicateConditions: Prisma.ClientWhereInput[] = [];
        if (updateClientDto.email) {
            duplicateConditions.push({ email: updateClientDto.email });
        }

        if (updateClientDto.NIT) {
            duplicateConditions.push({ NIT: updateClientDto.NIT });
        }

        if (duplicateConditions.length > 0) {
            const duplicatedClient = await this.prisma.client.findFirst({
                where: {
                    id: {
                        not: id,
                    },
                    OR: duplicateConditions,
                },
            });

            if (duplicatedClient) {
                throw new ConflictException(
                    'A client with this email or tax ID already exists.',
                );
            }
        }

        return this.prisma.client.update({
            where: { id },
            data: {
                companyName: updateClientDto.companyName,
                address: updateClientDto.address,
                phone: updateClientDto.phone,
                NIT: updateClientDto.NIT,
                email: updateClientDto.email,
                contactFirstName: updateClientDto.contactFirstName,
                contactLastName: updateClientDto.contactLastName,
            },
            select: clientSelect,
        });
    }

    async deactivate(id: string) {
        const client = await this.prisma.client.findUnique({
            where: { id },
        }); 

        if (!client) {
            throw new NotFoundException('Client not found.');
        }   

        if (!client.isActive) {
            throw new BadRequestException('Client is already inactive.');
        }   

        return this.prisma.client.update({
            where: { id },
            data: {
                isActive: false,
            },
            select: clientSelect,
        });
      } 

      async activate(id: string) {
        const client = await this.prisma.client.findUnique({
            where: { id },
        }); 

        if (!client) {
            throw new NotFoundException('Client not found.');
        }   

        if (client.isActive) {
            throw new BadRequestException('Client is already active.');
        }   

        return this.prisma.client.update({
            where: { id },
            data: {
                isActive: true,
            },
            select: clientSelect,
        });
    }
}
