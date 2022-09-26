import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import mongoose from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}
  @Post('registration')
  async registration(@Body() registerDro: RegisterDto) {
    return await this.authService.registration(registerDro);
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() id: mongoose.Types.ObjectId) {
    return await this.authService.login(id);
  }
}
