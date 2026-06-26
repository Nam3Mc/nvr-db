import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { InfestationLevel, PestType } from 'src/generated/prisma/enums';

export class UpdateServicePestDto {
    @ApiPropertyOptional({
        enum: PestType,
        example: PestType.RAT,
        description: 'Updated pest type',
    })
    @IsOptional()
    @IsEnum(PestType)
    type?: PestType;

    @ApiPropertyOptional({
        enum: InfestationLevel,
        example: InfestationLevel.MEDIUM,
        description: 'Updated infestation level',
    })
    @IsOptional()
    @IsEnum(InfestationLevel)
    infestationLevel?: InfestationLevel;
}