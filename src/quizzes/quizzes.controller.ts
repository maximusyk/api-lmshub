import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto, QuizEntityDto, UpdateQuizDto } from './dto/quizzes.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';
import { AuthAccess } from '../auth/decorators/auth.decorator';
import { RoleEnum } from '../roles/enums/role.enum';

@Controller('quizzes')
@ApiTags('Quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) { }

    @ApiOperation({ summary: 'Create quiz' })
    @ApiResponse(
        {
            status: 201,
            type: QuizEntityDto,
            description: 'Quiz successfully created',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Post()
    create(@Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.create(createQuizDto);
    }

    @ApiOperation({ summary: 'Get all quizzes' })
    @ApiResponse(
        {
            status: 200,
            type: QuizEntityDto,
            isArray: true,
            description: 'Get all quizzes',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get()
    findAll() {
        return this.quizzesService.findAll();
    }

    @ApiOperation({ summary: 'Get one quiz by ID' })
    @ApiResponse(
        {
            status: 200,
            type: QuizEntityDto,
            description: 'Get quiz by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([])
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.quizzesService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update quiz' })
    @ApiResponse(
        {
            status: 200,
            type: QuizEntityDto,
            description: 'Update quiz by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateQuizDto: UpdateQuizDto) {
        return this.quizzesService.update(params?.id, updateQuizDto);
    }

    @ApiOperation({ summary: 'Remove quiz' })
    @ApiResponse(
        {
            status: 200,
            description: 'Remove quiz by ID',
        },
    )
    @ApiBearerAuth()
    @AuthAccess([RoleEnum.ADMIN, RoleEnum.PROFESSOR])
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.quizzesService.remove(params?.id);
    }
}
