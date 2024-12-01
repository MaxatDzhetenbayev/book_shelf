import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favorit } from './entities/favorit.entity';
import { Book } from 'src/books/entities/book.entity';
import { Genre } from 'src/genres/entities/genre.entity';

@Injectable()
export class FavoritsService {
  constructor(
    @InjectModel(Favorit)
    private faviritRepository: typeof Favorit,
  ) {}
  private readonly logger = new Logger(this.faviritRepository.name);

  async addBooksToCart({ userId, bookId }: { userId: number; bookId: number }) {
    try {
      this.logger.log(`Add books to favorit for user: ${userId}...`);

      const addedBooks = await this.faviritRepository.create({
        userId,
        bookId,
      });

      if (!addedBooks) {
        throw new InternalServerErrorException(
          'Book could not be added to favorit',
        );
      }

      this.logger.log(`Added Books finish. `);
      return addedBooks;
    } catch (error) {
      this.logger.error(`Book could not be created. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Books could not be added to cart. Error message: ${error}`,
      );
    }
  }

  async findAllUserBooks(userId: number) {
    try {
      const existingBooks = await this.faviritRepository.findAll({
        where: { userId },
        attributes: {
          exclude: ['userId', 'bookId'],
        },
        include: {
          model: Book,
          include: [Genre],
        },
      });

      if (!existingBooks.length) {
        return [];
      }

      return existingBooks;
    } catch (error) {
      this.logger.error(`Book could not be finded. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Books could not be finded. Error message: ${error}`,
      );
    }
  }

  async removeBookFromUserFavorits(userId: number, id: number) {
    try {
      this.logger.log(`Delete book from user favorits`);

      const book = await this.faviritRepository.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!book) {
        this.logger.error(`Book could not be finded`);
        throw new NotFoundException(`Book could not be finded`);
      }

      return {
        message: 'Book deleted',
      };
    } catch (error) {
      this.logger.error(`Book could not be deleted. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Book could not be deleted. Error message: ${error}`,
      );
    }
  }
}
