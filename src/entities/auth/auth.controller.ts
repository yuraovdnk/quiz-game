import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import mongoose from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registerDro: RegisterDto) {
    return await this.authService.registration(registerDro);
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@CurrentUser() id: mongoose.Types.ObjectId) {
    const jwt = await this.authService.login(id);
    return jwt;
  }
}
