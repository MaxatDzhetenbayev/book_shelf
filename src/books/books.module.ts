import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [SequelizeModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService, RolesGuard],
})
export class BooksModule {}
