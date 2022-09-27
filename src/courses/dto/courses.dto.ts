import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { UserEntityDto } from '../../users/dto/users.dto';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { ChapterEntityDto } from '../../chapters/dto/chapters.dto';
import { Group } from '../../groups/entities/group.entity';
import { GroupEntityDto } from '../../groups/dto/groups.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { SortDirection } from 'src/dto/main.dto';

export class CourseEntityDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    professorId: string;

    @ApiProperty({ type: () => UserEntityDto })
    professor: User;

    @ApiProperty({ type: () => [ChapterEntityDto] })
    chapters: Chapter[];

    @ApiProperty({ type: () => [GroupEntityDto] })
    assignedGroups: Group[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description?: string;

    @IsOptional()
    @IsUUID(4, { message: 'Professor ID must be a valid UUID' })
    @ApiProperty()
    professorId?: string;
}

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    description?: string;

    @IsOptional()
    @IsUUID(4, { message: 'Professor ID must be a valid UUID' })
    @ApiProperty({ required: false })
    professorId?: string;
}

export class SearchCourseDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    search?: string;

    @IsOptional()
    @IsUUID(4, { each: true })
    @ApiProperty({ required: false, isArray: true })
    professorIds?: string[];

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, default: SortDirection.ASC, description: 'Sort direction' })
    sortDirection?: SortDirection = SortDirection.ASC;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, default: 'createdAt', description: 'Sort field' })
    sortField?: string = 'createdAt';

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false, default: 1, description: 'Page number' })
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false, default: 20, description: 'Page size' })
    pageSize?: number = 20;
}
