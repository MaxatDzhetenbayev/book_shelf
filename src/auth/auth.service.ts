import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Sequelize } from 'sequelize-typescript';
import { CartsService } from 'src/carts/carts.service';

export type LoginWithUserTicket = Omit<LoginDto, 'password'> & {
  id?: number;
  ticket: string;
  role: string;
};

export class FullUserDto extends IntersectionType(
  OmitType(CreateProfileDto, ['user_id'] as const),
  CreateUserDto,
) {}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private profileService: ProfilesService,
    private cartsService: CartsService,
    private jwtService: JwtService,
    private sequelize: Sequelize,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    const user = await this.usersService.finByPhone(phone);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  login(loginDto: any): string {
    const { passwordHash, createdAt, updatedAt, ...payload } = loginDto;

    const token = this.jwtService.sign(payload);

    return token;
  }

  async register(registerDto: FullUserDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const existingUser = await this.usersService.finByPhone(
        registerDto.phone,
      );

      if (existingUser) {
        throw new BadRequestException('A user with this login already exists');
      }

      const { place_of_residence, name, surname, organization, ...userDto } =
        registerDto;

      const { phone, password, ...profileDto } = registerDto;

      const user = await this.usersService.create(userDto, transaction);
      await this.profileService.create(
        { ...profileDto, user_id: user.dataValues.id },
        transaction,
      );

      const token = this.jwtService.sign({
        id: user.id,
        phone: user.phone,
        role: user.role,
      });

      await transaction.commit();
      return token;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        `Error while user register. Error message: ${error}`,
      );
    }
  }
}
