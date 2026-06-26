import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'EcoShield Restaurant',
    description: 'Client company or business name.',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: 'Cra 15 #93-47, Bogotá, Colombia',
    description: 'Client service address.',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '+573001112233',
    description: 'Client contact phone number.',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: '901234567-8',
    description: 'Client tax identification number.',
  })
  @IsOptional()
  @IsString()
  @Length(5, 30)
  NIT?: string;

  @ApiPropertyOptional({
    example: 'contact@ecoshield.com',
    description: 'Client contact email.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Michael',
    description: 'Main contact first name.',
  })
  @IsOptional()
  @IsString()
  contactFirstName?: string;

  @ApiPropertyOptional({
    example: 'Johnson',
    description: 'Main contact last name.',
  })
  @IsOptional()
  @IsString()
  contactLastName?: string;
}