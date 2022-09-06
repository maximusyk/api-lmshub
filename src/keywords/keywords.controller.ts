import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { ParamsIdDto } from '../dto/main.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('keywords')
export class KeywordsController {
    constructor(private readonly keywordsService: KeywordsService) { }

    @ApiOperation({ summary: 'Create keyword' })
    @Post()
    create(@Body() createKeywordDto: CreateKeywordDto) {
        return this.keywordsService.create(createKeywordDto);
    }

    @ApiOperation({ summary: 'Get all keywords' })
    @Get()
    findAll() {
        return this.keywordsService.findAll();
    }

    @ApiOperation({ summary: 'Get one keyword by ID' })
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.keywordsService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update keyword' })
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateKeywordDto: UpdateKeywordDto) {
        return this.keywordsService.update(params?.id, updateKeywordDto);
    }

    @ApiOperation({ summary: 'Remove keyword' })
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.keywordsService.remove(params?.id);
    }
}
