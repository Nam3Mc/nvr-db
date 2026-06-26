import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
     MaxFileSizeValidator,
    ParseFilePipe,
    UploadedFile,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from '@nestjs/swagger';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_IN_BYTES,
} from '../cloudinary/cloudinary.constants';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('user')
export class UserController {
    constructor( private readonly userService: UserService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new Usser',
        description: 'Creates an admin or technician user with a hashed password.',
    })
    @ApiCreatedResponse({
        description: 'User created Successfully',
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get All users',
        description: 'Returns all users without exposing password hashes.',
    })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get one user by id',
        description: 'Returns a single user without exposing the password hash.', 
    })
    @ApiParam({
        name: 'id',
        description: 'User UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
      description: 'User found successfully.',
    })
    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update one user by id',
        description: 'Updates user data. If password is provided, it will be hashed before saving.',
    })
    @ApiParam({
        name: 'id',
        description: 'User UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'User updated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'User not found.',
    })
    update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,) {
        return this.userService.update(id, updateUserDto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({
      summary: 'Deactivate one user by id',
      description:
        'Soft-deactivates a user without deleting historical service records.',
    })
    @ApiParam({
      name: 'id',
      description: 'User UUID.',
      example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
      description: 'User deactivated successfully.',
    })
    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    deactivate(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.deactivate(id);
    }

    @Patch(':id/activate')
    @ApiOperation({
        summary: 'Activate one user by id',
        description: 'Reactivates a previously deactivated user so they can operate in the system again.',
    })
    @ApiParam({
        name: 'id',
        description: 'User UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
      description: 'User activated successfully.',
    })
    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    activate(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.activate(id);
    }

    @Patch(':id/profile-photo')
    @UseInterceptors(FileInterceptor('photo'))
    @ApiOperation({
      summary: 'Upload user profile photo',
      description: 'Uploads a profile photo to Cloudinary and saves the image URL.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                photo: {
                    type: 'string',
                    format: 'binary',
                    description: 'User profile image file. Allowed: JPG, PNG, WEBP.',
                },
            },
            required: ['photo'],
        }
    })
    @ApiParam({
      name: 'id',
      description: 'User UUID.',
      example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
      description: 'Profile photo uploaded successfully.',
    })
    @ApiNotFoundResponse({
      description: 'User not found.',
    })
    uploadProfilePhoto(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: MAX_IMAGE_SIZE_IN_BYTES,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
            throw new Error('Invalid image type. Only JPG, PNG, and WEBP are allowed.');
        }

        return this.userService.uploadProfilePhoto(id, file)
    }

}
