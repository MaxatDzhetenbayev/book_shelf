import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddBookToFavoritDTO } from './dto/add-to-favorit.dto.ts.js';
import { FavoritsService } from './favofirts.service.js';

@Controller('favorits')
export class FavoritsController {
  constructor(private readonly cartsService: FavoritsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  toggleBooksToFavorits(
    @Request() req,
    @Body() { bookId }: AddBookToFavoritDTO,
  ) {
    const { id: userId } = req.user;

    return this.cartsService.toggleBooksToFavorit({ userId, bookId });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const { id: userId } = req.user;
    return this.cartsService.findAllUserBooks(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    const { id: userId } = req.user;
    return this.cartsService.removeBookFromUserFavorits(userId, +id);
  }
}
