import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LectureReferencesService } from './lecture-references.service';
import { CreateLectureReferenceDto } from './dto/create-lecture-reference.dto';
import { UpdateLectureReferenceDto } from './dto/update-lecture-reference.dto';
import { ParamsIdDto } from '../dto/main.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('lecture-references')
export class LectureReferencesController {
    constructor(private readonly lectureReferencesService: LectureReferencesService) { }

    @ApiOperation({ summary: 'Create lecture reference' })
    @Post()
    create(@Body() createLectureReferenceDto: CreateLectureReferenceDto) {
        return this.lectureReferencesService.create(createLectureReferenceDto);
    }

    @ApiOperation({ summary: 'Get all lecture references' })
    @Get()
    findAll() {
        return this.lectureReferencesService.findAll();
    }

    @ApiOperation({ summary: 'Get one lecture reference by ID' })
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.lectureReferencesService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update lecture reference' })
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateLectureReferenceDto: UpdateLectureReferenceDto) {
        return this.lectureReferencesService.update(params?.id, updateLectureReferenceDto);
    }

    @ApiOperation({ summary: 'Remove lecture reference' })
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.lectureReferencesService.remove(params?.id);
    }
}
