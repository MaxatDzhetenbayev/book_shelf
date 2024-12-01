import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BooksModule } from './books/books.module';
import { GenresModule } from './genres/genres.module';
import { Genre } from './genres/entities/genre.entity';
import { Book } from './books/entities/book.entity';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { User } from './users/entities/user.entity';
import { Profile } from './profiles/entities/profile.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { Favorit } from './favorits/entities/favorit.entity';
import { FavofirtsModule } from './favorits/favorits.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    SequelizeModule.forRootAsync({
      useFactory: async () => ({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB,
        logging: process.env.DB_LOGGING === 'true',
        models: [User, Profile, Genre, Book, Cart, Favorit],
      }),
    }),
    UsersModule,
    ProfilesModule,
    BooksModule,
    GenresModule,
    AuthModule,
    CartsModule,
    FavofirtsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
