import { Module } from '@nestjs/common';
import { FavoritsService } from './favofirts.service';
import { FavoritsController } from './favorits.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorit } from './entities/favorit.entity';

@Module({
  imports: [SequelizeModule.forFeature([Favorit])],
  controllers: [FavoritsController],
  providers: [FavoritsService],
})
export class FavofirtsModule {}
