import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './entities/cart.entity';
import { Transaction } from 'sequelize';
import { Book } from 'src/books/entities/book.entity';
import { Genre } from 'src/genres/entities/genre.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart)
    private cartRepository: typeof Cart,
  ) {}
  private readonly logger = new Logger(this.cartRepository.name);

  async addBooksToCart({ userId, books }: { userId: number; books: number[] }) {
    try {
      this.logger.log(`Add books to cart for user: ${userId}...`);

      const bookEntries = books.map((bookId) => ({
        userId,
        bookId,
      }));

      const addedBooks = await this.cartRepository.bulkCreate(bookEntries);

      if (addedBooks.length <= 0) {
        throw new InternalServerErrorException(
          'Books could not be added to cart',
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
      const existingBooks = await this.cartRepository.findAll({
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
      this.logger.error(`Book could not be created. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Books could not be finded from cart. Error message: ${error}`,
      );
    }
  }

  async removeBookFromUserCart(userId: number, id: number) {
    try {
      this.logger.log(`Delete book from user cart `);

      const book = await this.cartRepository.findOne({
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
