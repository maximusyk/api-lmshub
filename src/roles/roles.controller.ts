import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, RoleEntityDto, UpdateRoleDto } from './dto/roles.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from './enums/role.enum';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @ApiOperation({ summary: 'Create role' })
    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            description: 'Role successfully created',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN])
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            isArray: true,
            description: 'Get all roles',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN])
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @ApiOperation({ summary: 'Get one role by ID' })
    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            description: 'Get role by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.rolesService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update role' })
    @ApiResponse(
        {
            status: 200,
            type: RoleEntityDto,
            description: 'Update role by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(params?.id, updateRoleDto);
    }

    @ApiOperation({ summary: 'Remove role' })
    @ApiResponse(
        {
            status: 200,
            description: 'Remove role by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.rolesService.remove(params?.id);
    }
}
