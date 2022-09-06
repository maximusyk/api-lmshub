import { ApiProperty } from '@nestjs/swagger';
import { RoleEntityDto } from '../../roles/dto/roles.dto';
import { Role } from '../../roles/entities/role.entity';
import { GroupEntityDto } from '../../groups/dto/groups.dto';
import { Group } from '../../groups/entities/group.entity';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

export class UserEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty({ required: false })
    password?: string;

    @ApiProperty()
    roleId: string;

    @ApiProperty({ type: () => RoleEntityDto })
    role: Role;

    @ApiProperty()
    groupId: string;

    @ApiProperty({ type: () => GroupEntityDto })
    group: Group;

    @ApiProperty()
    isRegisteredByGoogle: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    @ApiProperty({ required: false })
    phone?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    hashedPassword?: string;

    @IsNotEmpty()
    @IsUUID(4)
    @ApiProperty()
    roleId: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    groupId?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    isRegisteredByGoogle?: boolean;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    firstName?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    lastName?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    username?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ required: false })
    email?: string;

    @IsOptional()
    @IsPhoneNumber('UA')
    @ApiProperty({ required: false })
    phone?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    password?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    roleId?: string;

    @IsOptional()
    @IsUUID(4)
    @ApiProperty({ required: false })
    groupId?: string;
}
