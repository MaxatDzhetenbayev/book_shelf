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
import { Response } from 'express';

@Injectable()
export class FavoritsService {
  constructor(
    @InjectModel(Favorit)
    private favoriteRepository: typeof Favorit,
  ) {}
  private readonly logger = new Logger(this.favoriteRepository.name);

  async toggleBooksToFavorit({
    userId,
    bookId,
    res,
  }: {
    userId: number;
    bookId: number;
    res: Response;
  }) {
    try {
      this.logger.log(`Add books to favorit for user: ${userId}...`);

      const existingFaviorit = await this.favoriteRepository.findOne({
        where: {
          userId,
          bookId,
        },
      });

      if (existingFaviorit) {
        const deletedBooks = await this.favoriteRepository.destroy({
          where: {
            userId,
            bookId,
          },
        });
        if (!deletedBooks) {
          throw new InternalServerErrorException(
            'Book could not be deleted from favorit',
          );
        }
        this.logger.log(`Deleted Books finish. `);
        return res.status(200).json({ message: 'Deleted' });
      }

      const addedBooks = await this.favoriteRepository.create({
        userId,
        bookId,
      });

      if (!addedBooks) {
        throw new InternalServerErrorException(
          'Book could not be added to favorit',
        );
      }

      this.logger.log(`Added Books finish. `);
      return res.status(201).json({ message: 'Created' });
    } catch (error) {
      this.logger.error(`Book could not be created. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Books could not be added to cart. Error message: ${error}`,
      );
    }
  }

  async findAllUserFavorites(userId: number): Promise<any> {
    try {
      const existingBooks = await this.favoriteRepository.findAll({
        where: { userId },
        attributes: {
          exclude: ['userId', 'bookId'],
        },
        include: [
          {
            model: Book,
            attributes: ['id', 'author', 'images', 'content'], // Указываем только нужные поля
            include: [
              {
                model: Genre,
              },
            ],
          },
        ],
      });

      if (!existingBooks.length) {
        return [];
      }

      const formattedBooks = existingBooks.map((item) => ({
        id: item.book.id,
        author: item.book.author,
        images: item.book.images,
        content: item.book.content,
        genreId: item.book.genre_id,
        genre: item.book.genre.content, // Если нужно вывести только контент жанра
      }));

      return formattedBooks;
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

      const book = await this.favoriteRepository.findOne({
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
