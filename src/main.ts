import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, ExpressSwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function start() {
    const PORT = process.env.PORT || 5500;
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: 'http://localhost:4200',
            credentials: true
        }
    });

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    const configService = app.get(ConfigService);

    config.update({
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
        region: configService.get('AWS_REGION')
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Coursuch API')
        .setVersion('v0.1.0')
        .addServer('https://coursuch-lms.herokuapp.com/api', 'Coursuch Remote')
        .addServer(`http://localhost:${configService.get('PORT')}/api`, 'Coursuch Local')
        .addBearerAuth()
        .addTag('Auth', 'Auth endpoints', { url: '/auth' })
        .addTag('Users', 'Users endpoints', { url: '/users' })
        .addTag('Groups', 'Groups endpoints', { url: '/groups' })
        .addTag('Roles', 'Roles endpoints', { url: '/roles' })
        .addTag('Tokens', 'Tokens endpoints', { url: '/tokens' })
        .addTag('Courses', 'Courses endpoints', { url: '/courses' })
        .addTag('Chapters', 'Chapters endpoints', { url: '/chapters' })
        .addTag('Lectures', 'Lectures endpoints', { url: '/lectures' })
        .addTag('Units', 'Units endpoints', { url: '/units' })
        .addTag('Quizzes', 'Quizzes endpoints', { url: '/quizzes' })
        .build();

    const expressSwaggerCustomOptions: ExpressSwaggerCustomOptions = {
        swaggerOptions: {
            docExpansion: 'none'
        }
    };

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('/docs', app, document, expressSwaggerCustomOptions);

    fs.writeFileSync('swagger.json', JSON.stringify(document), { encoding: 'utf8' });

    app.setGlobalPrefix('api');
    await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
