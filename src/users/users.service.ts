import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  private readonly logger = new Logger(this.userRepository.name);

  async create(createUserDto: CreateUserDto, transaction?: Transaction) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      this.logger.log('Creating user...');
      const user = await this.userRepository.create(
        {
          ...createUserDto,
          passwordHash: hashedPassword,
        },
        {
          transaction,
        },
      );

      if (!user) {
        throw new InternalServerErrorException('User could not be created');
      }

      const maxCharLength = 6;
      const ticketValue = user.id.toString().padStart(maxCharLength, '0');

      await user.update(
        {
          ticket: ticketValue,
        },
        { transaction },
      );

      const { passwordHash, ...dto } = user;

      this.logger.log(`User created finish. ID: ${user.id}`);
      return dto;
    } catch (error) {
      this.logger.error(`User could not be created. Error message: ${error}`);
      throw new InternalServerErrorException(
        `User could not be created. Error message: ${error}`,
      );
    }
  }

  async finByPhone(phone: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        phone,
      },
    });

    return user?.dataValues;
  }

  async getProfile(id: number) {
    const profile = await this.userRepository.findOne({
      where: { id },
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt'],
      },
      include: {
        model: Profile,
        attributes: {
          exclude: ['id', 'user_id', 'createdAt', 'updatedAt'],
        },
      },
    });
    return profile;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
