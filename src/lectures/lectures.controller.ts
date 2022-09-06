import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureDto, LectureEntityDto, UpdateLectureDto } from './dto/lectures.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

// import { Express } from 'express';

@Controller('lectures')
@ApiTags('Lectures')
export class LecturesController {
    constructor(private readonly lecturesService: LecturesService) { }

    @ApiOperation({ summary: 'Read lecture | Get lecture content' })
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Get('/file/:id')
    readLecture(@Param() params: ParamsIdDto) {
        return this.lecturesService.readLectureS3(params?.id);
    }

    @ApiOperation({ summary: 'Edit lecture | Edit lecture content' })
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Patch('/file/:id')
    @UseInterceptors(FileInterceptor('lectureFile'))
    editLecture(@Param() params: ParamsIdDto, @UploadedFile() lectureFile: Express.Multer.File) {
        return this.lecturesService.editLectureS3(params?.id, lectureFile);
    }

    @ApiOperation({ summary: 'Create lecture' })
    @ApiResponse(
        {
            status: 201,
            type: LectureEntityDto,
            description: 'Lecture successfully created'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Post()
    @UseInterceptors(FileInterceptor('lectureFile'))
    create(@Body() createLectureDto: CreateLectureDto, @UploadedFile() lectureFile: Express.Multer.File) {
        return this.lecturesService.create({ ...createLectureDto, lectureFile });
    }

    @ApiOperation({ summary: 'Get all lectures' })
    @ApiResponse(
        {
            status: 200,
            type: LectureEntityDto,
            isArray: true,
            description: 'Get all lectures'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get()
    findAll() {
        return this.lecturesService.findAll();
    }

    @ApiOperation({ summary: 'Get one lecture by ID' })
    @ApiResponse(
        {
            status: 200,
            type: LectureEntityDto,
            description: 'Get lecture by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.lecturesService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update lecture' })
    @ApiResponse(
        {
            status: 200,
            type: LectureEntityDto,
            description: 'Update lecture by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateLectureDto: UpdateLectureDto) {
        return this.lecturesService.update(params?.id, updateLectureDto);
    }

    @ApiOperation({ summary: 'Remove lecture' })
    @ApiResponse(
        {
            status: 200,
            description: 'Remove lecture by ID'
        }
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.lecturesService.remove(params?.id);
    }
}
