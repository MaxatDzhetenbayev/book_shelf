import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private genreRepository: typeof Genre,
  ) {}

  private readonly logger = new Logger(this.genreRepository.name);

  async create(createGenreDto: CreateGenreDto) {
    try {
      const createdGenre = await this.genreRepository.create(createGenreDto);
      if (!createdGenre) {
        throw new InternalServerErrorException('Failed to create genre.');
      }

      return createdGenre;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Genre with this name already exists.');
      }
      this.logger.error('Error occurred while creating genre', error);
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  findAll() {
    return `This action returns all genres`;
  }

  findOne(id: number) {
    return `This action returns a #${id} genre`;
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
