import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    ArrayUnique,
    IsArray,
    IsDateString,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({
        example: 'a58eb74e-398e-426f-b901-b8d410c6f17a',
        description: 'Client ID related to the service',
    })
    @IsUUID()
    clientId: string;

    @ApiProperty({
        example: [
            'd9969184-b2ce-4634-bd35-a4cf140dced3'
        ],
        description: 'Technician IDs assigned to the service',
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    technicianIds: string[];

    @ApiProperty({
        example: '2026-06-28T14:00:00.000Z',
        description: 'Date and time when the service is scheduled',
    })
    @IsDateString()
    scheduledAt: string;

    @ApiProperty({
        example: 450000,
        description: 'Service Price',
    })
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    servicePrice: number;

    @ApiPropertyOptional({
        example: 'Client requested morning service. Bring rodent traps.',
        description: 'General service observations',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    notes?: string;

    @ApiPropertyOptional({
        example: '2027-06-28',
        description: 'Certificate expiration date',
    })
    @IsOptional()
    @IsDateString()
    certificateExpiresAt?: string;
}