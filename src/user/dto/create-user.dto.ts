import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../generated/prisma/enums';

export class CreateUserDto {

  @ApiProperty({
    example: 'Carlos',
    description: 'User first name.',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Ramirez',
    description: 'User last name.',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'carlos.ramirez@example.com',
    description: 'Unique user email.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+573001112233',
    description: 'User phone number.',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '1020304050',
    description: 'User document number.',
  })
  @IsString()
  @Length(6, 20)
  documentNumber: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Plain password received from the client. It must be hashed before saving.',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.TECHNICIAN,
    description: 'User role inside the system.',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}