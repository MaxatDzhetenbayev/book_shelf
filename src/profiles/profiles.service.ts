import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile)
    private profileRepository: typeof Profile,
  ) {}
  private readonly logger = new Logger(this.profileRepository.name);

  async create(createProfileDto: CreateProfileDto, transaction?: Transaction) {
    console.log('Transaction Profile:', transaction);
    try {
      this.logger.log('Creating user profile...');
      const user_profile = await this.profileRepository.create(
        {
          ...createProfileDto,
        },
        { transaction },
      );

      if (!user_profile) {
        throw new InternalServerErrorException(
          'User Profile could not be created',
        );
      }

      this.logger.log(`User Profile created finish. ID: ${user_profile.id}`);
      return user_profile;
    } catch (error) {
      this.logger.error(
        `User Profile could not be created. Error message: ${error}`,
      );
      throw new InternalServerErrorException(
        `User Profile could not be created. Error message: ${error}`,
      );
    }
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
