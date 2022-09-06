import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AssignCourseDto, CreateGroupDto, GroupEntityDto, UpdateGroupDto } from './dto/groups.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';

@Controller('groups')
@ApiTags('Groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @ApiOperation({ summary: 'Create group' })
    @ApiResponse(
        {
            status: 201,
            type: GroupEntityDto,
            description: 'Group successfully created'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @ApiOperation({ summary: 'Assign course to group' })
    @ApiResponse(
        {
            status: 201,
            type: GroupEntityDto,
            description: 'Course successfully assigned to group'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Post('assign-course/:id')
    assignCourse(@Param() params: ParamsIdDto, @Body() assignCourseDto: AssignCourseDto) {
        return this.groupsService.assignCourse(params?.id, assignCourseDto);
    }

    @ApiOperation({ summary: 'Get all group' })
    @ApiResponse(
        {
            status: 200,
            type: GroupEntityDto,
            isArray: true,
            description: 'All groups'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get()
    findAll() {
        return this.groupsService.findAll();
    }

    @ApiOperation({ summary: 'Get one group by ID' })
    @ApiResponse(
        {
            status: 200,
            type: GroupEntityDto,
            description: 'One group by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.groupsService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update group' })
    @ApiResponse(
        {
            status: 200,
            type: GroupEntityDto,
            description: 'Update group by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateGroupDto: UpdateGroupDto) {
        return this.groupsService.update(params?.id, updateGroupDto);
    }

    @ApiOperation({ summary: 'Remove group' })
    @ApiResponse(
        {
            status: 200,
            description: 'Remove group by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.groupsService.remove(params?.id);
    }
}
