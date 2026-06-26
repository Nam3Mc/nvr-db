import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { InfestationLevel, PestType } from 'src/generated/prisma/enums';

export class CreateServicePestDto {
    @ApiProperty({
        example: 'b8f21b0c-91ec-4f17-b92f-0cb3b3f01311',
        description: 'Service ID where the pest record belongs',
    })
    @IsUUID()
    serviceId: string;

    @ApiProperty({
        enum: PestType,
        example: PestType.COCKROACH,
        description: 'Type of pest found during the service',
    })
    @IsEnum(PestType)
    type: PestType;

    @ApiPropertyOptional({
        enum: InfestationLevel,
        example: InfestationLevel.LOW,
        description: 'Infestation level found during the service',
        default: InfestationLevel.NONE,
    })
    @IsOptional()
    @IsEnum(InfestationLevel)
    infestationLevel?: InfestationLevel;
}