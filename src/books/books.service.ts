import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { Book } from './entities/book.entity';
import { FindBooksQueryParamsDto } from './dto/find-books-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Genre } from 'src/genres/entities/genre.entity';
import { Favorit } from 'src/favorits/entities/favorit.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(this.bookRepository.name);

  async create(createBookDto: CreateBookDto) {
    try {
      const book = await this.bookRepository.create(createBookDto);
      this.logger.log('Creating book...');

      if (!book) {
        throw new InternalServerErrorException('Book could not be created');
      }

      this.logger.log(`Book created finish. ID: ${book.id}`);
      return book;
    } catch (error) {
      this.logger.error(`Book could not be created. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Book could not be created. Error message: ${error}`,
      );
    }
  }

  async findAll(query: FindBooksQueryParamsDto): Promise<any> {
    const { search, locale, user } = query;
    let where = {};
    const { id: userId } = user ? this.jwtService.verify(user) : { id: null };

    if (search && locale) {
      where[sequelize.Op.and] = [
        ...(where[sequelize.Op.and] || []),
        sequelize.where(
          sequelize.literal(`LOWER(content->'${locale}'->>'title')`),
          {
            [sequelize.Op.iLike]: `%${search.toLowerCase()}%`,
          },
        ),
      ];
    }

    try {
      const books = await this.bookRepository.findAll({
        where,
        attributes: {
          exclude: ['genre_id'],
        },
        include: [
          {
            model: Genre,
            attributes: {
              exclude: ['id'],
            },
          },
          {
            model: Favorit,
          },
        ],
      });

      const response = await Promise.all(
        books.map(async (book) => {
          const { favorits, ...bookInfo } = book.toJSON();

          return {
            ...bookInfo,
            hasFavorite: favorits.some(
              (favorit: Favorit) => favorit.userId === userId,
            ),
          };
        }),
      );

      return response;
    } catch (error) {
      this.logger.error(`Books could not be found. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Books could not be found. Error message: ${error}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log(`Finding book with ID: ${id}`);
      const book = await this.bookRepository.findByPk(id);

      if (!book) {
        throw new NotFoundException(`Book with ID ${id} could not be found`);
      }

      this.logger.log(`Book with ID ${id} finded`);
      return book;
    } catch (error) {
      this.logger.error(`Book could not be found. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Book could not be finded. Error message: ${error}`,
      );
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const book = await this.bookRepository.findByPk(id);

      if (!book)
        throw new NotFoundException(`Book with ID ${id} could not be finded`);

      await book.update(updateBookDto);
      return book;
    } catch (error) {
      this.logger.error(`Book could not be updated. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Book could not be updated. Error message: ${error}`,
      );
    }
  }

  async remove(id: number) {
    try {
      this.logger.log(`Delete start book with ID ${id}`);

      const book = await this.bookRepository.findByPk(id);

      if (!book) {
        this.logger.error(`Book with ID ${id} could not be finded`);
        throw new NotFoundException(`Book with ID ${id} could not be finded`);
      }

      return book.destroy();
    } catch (error) {
      this.logger.error(`Book could not be deleted. Error message: ${error}`);
      throw new InternalServerErrorException(
        `Book could not be deleted. Error message: ${error}`,
      );
    }
  }
}
