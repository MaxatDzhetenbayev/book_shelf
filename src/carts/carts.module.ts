import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [SequelizeModule.forFeature([Cart])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
