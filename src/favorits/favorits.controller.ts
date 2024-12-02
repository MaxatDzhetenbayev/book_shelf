import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddBookToFavoritDTO } from './dto/add-to-favorit.dto.ts.js';
import { FavoritsService } from './favofirts.service.js';
import { Response } from 'express';

@Controller('favorites')
export class FavoritsController {
  constructor(private readonly cartsService: FavoritsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  toggleBooksToFavorits(
    @Request() req,
    @Body() { bookId }: AddBookToFavoritDTO,
    @Res() res: Response,
  ) {
    const { id: userId } = req.user;

    return this.cartsService.toggleBooksToFavorit({ userId, bookId, res });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const { id: userId } = req.user;
    return this.cartsService.findAllUserBooks(userId);
  }
}
