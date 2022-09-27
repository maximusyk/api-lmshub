import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto, SearchCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { Course } from './entities/course.entity';
import { ChaptersService } from '../chapters/chapters.service';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '../roles/enums/role.enum';
import { SortDirection } from 'src/dto/main.dto';
import { CountOptions, FindOptions, Op } from 'sequelize';
import validator from 'validator';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course) private readonly courseRepository: typeof Course,
        @Inject(forwardRef(() => ChaptersService))
        private readonly chapterService: ChaptersService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) {}

    async create(createCourseDto: CreateCourseDto) {
        try {
            if (!createCourseDto.professorId) {
                throw new HttpException('Professor is required', HttpStatus.BAD_REQUEST);
            }

            await this.usersService.checkRole(createCourseDto.professorId, RoleEnum.PROFESSOR);

            return this.courseRepository.create(createCourseDto, { include: { all: true } });
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(searchData: SearchCourseDto) {
        try {
            let {
                search,
                type,
                professorIds,
                sortDirection = SortDirection.ASC,
                sortField = 'createdAt',
                page = 1,
                pageSize = 20,
            } = searchData;

            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 1;

            const offset = (page - 1) * pageSize;
            const limit = pageSize;

            if (![SortDirection.ASC, SortDirection.DESC].includes(sortDirection)) {
                sortDirection = SortDirection.ASC;
            }

            const attributes = Course.getAttributes();

            if (!attributes?.hasOwnProperty(sortField)) {
                throw new HttpException(
                    `ValidationError: sortField: ${sortField} not exist in Clinic!`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const findOptions: FindOptions & CountOptions = {
                where: {},
                offset,
                limit,
                order: [[sortField, sortDirection]],
                include: { all: true },
            };

            if (search) {
                findOptions.where['search'] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            if (type) {
                findOptions.where['type'] = type;
            }

            if (professorIds?.length) {
                professorIds.map(professorId => {
                    if (
                        (!professorId && professorId !== null) ||
                        (professorId && !validator.isUUID(professorId))
                    ) {
                        throw new HttpException(
                            'Some professorId is not a valid!',
                            HttpStatus.BAD_REQUEST,
                        );
                    }
                });

                findOptions.where['professorId'] = {
                    [Op.or]: [...new Set(professorIds)],
                };
            }

            const result = await this.courseRepository.findAndCountAll(findOptions);

            return {
                totalCount: result?.count,
                page,
                pageSize,
                offset,
                data: result?.rows,
            };
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string) {
        try {
            const course = await this.courseRepository.findByPk(id, { include: { all: true } });
            if (!course) {
                throw new HttpException('Course not found!', HttpStatus.NOT_FOUND);
            }

            return course;
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        try {
            if (updateCourseDto.professorId) {
                await this.usersService.checkRole(updateCourseDto.professorId, RoleEnum.PROFESSOR);
            }
            return this.courseRepository.update(updateCourseDto, { where: { id } });
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string) {
        try {
            if (!id) {
                throw new HttpException('id is required!', HttpStatus.BAD_REQUEST);
            }
            const chapter = await this.courseRepository
                .scope('withDeletedAt')
                .findOne({ where: { id } });
            if (!chapter) {
                throw new HttpException('Chapter not found!', HttpStatus.NOT_FOUND);
            }

            await chapter.destroy();

            return { id, statusCode: HttpStatus.OK, success: true };
        } catch (error) {
            throw new HttpException(error.message, error?.status || HttpStatus.BAD_REQUEST);
        }
    }
}
