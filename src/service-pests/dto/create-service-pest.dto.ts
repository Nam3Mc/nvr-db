import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { InfestationLevel, PestType } from 'src/generated/prisma/enums';

export class CreateServicePestDto {

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