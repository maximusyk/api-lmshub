import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateUpdateTokenDto, TokenEntityDto } from './dto/tokens.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamsIdDto } from '../dto/main.dto';

@Controller('tokens')
@ApiTags('Tokens')
export class TokensController {
    constructor(private readonly tokensService: TokensService) { }

    @ApiOperation({ summary: 'Create token' })
    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            description: 'Token successfully created',
        },
    )
    @Post()
    create(@Body() createTokenDto: CreateUpdateTokenDto) {
        return this.tokensService.create(createTokenDto);
    }

    @ApiOperation({ summary: 'Get all tokens' })
    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            isArray: true,
            description: 'Get all tokens',
        },
    )
    @Get()
    findAll() {
        return this.tokensService.findAll();
    }

    @ApiOperation({ summary: 'Get one token by ID' })
    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            description: 'Get token by ID',
        },
    )
    @Get(':id')
    findOne(@Param() params: ParamsIdDto) {
        return this.tokensService.findOne(params?.id);
    }

    @ApiOperation({ summary: 'Update token' })
    @ApiResponse(
        {
            status: 200,
            type: TokenEntityDto,
            description: 'Update token by ID',
        },
    )
    @Patch(':id')
    update(@Param() params: ParamsIdDto, @Body() updateTokenDto: CreateUpdateTokenDto) {
        return this.tokensService.update(params?.id, updateTokenDto.refreshToken);
    }

    @ApiOperation({ summary: 'Remove token' })
    @ApiResponse(
        {
            status: 200,
            description: 'Remove token by ID',
        },
    )
    @Delete(':id')
    remove(@Param() params: ParamsIdDto) {
        return this.tokensService.remove(params?.id);
    }
}
