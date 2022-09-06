import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChapterEntityDto, CreateChapterDto, UpdateChapterDto } from './dto/chapters.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';

@Controller('chapters')
@ApiTags('Chapters')
export class ChaptersController {
    constructor(private readonly chaptersService: ChaptersService) { }

    @ApiOperation({ summary: 'Create chapter' })
    @ApiResponse(
        {
            status: 201,
            type: ChapterEntityDto,
            description: 'Chapter successfully created',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Post()
    create(@Body() createChapterDto: CreateChapterDto) {
        return this.chaptersService.create(createChapterDto);
    }

    @ApiOperation({ summary: 'Get all chapters' })
    @ApiResponse(
        {
            status: 200,
            type: ChapterEntityDto,
            isArray: true,
            description: 'Get all chapters',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get()
    findAll() {
        return this.chaptersService.findAll();
    }

    @ApiOperation({ summary: 'Get one chapter by ID' })
    @ApiResponse(
        {
            status: 200,
            type: ChapterEntityDto,
            description: 'Get chapter by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get(':id')
    findById(@Param() params: ParamsIdDto) {
        return this.chaptersService.findById(params?.id);
    }

    @ApiOperation({ summary: 'Update chapter' })
    @ApiResponse(
        {
            status: 200,
            type: ChapterEntityDto,
            description: 'Update chapter by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateChapterDto: UpdateChapterDto) {
        return this.chaptersService.update(params?.id, updateChapterDto);
    }

    @ApiOperation({ summary: 'Remove chapter' })
    @ApiResponse(
        {
            status: 200,
            description: 'Remove chapter by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.chaptersService.remove(params?.id);
    }
}
