import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import mongoose from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(protected usersRepository: UsersRepository, protected jwtService: JwtService) {}
  async registration(registrationDto: RegisterDto) {
    const passwordHash = await this.generateHash(registrationDto.password);
    const newUser = {
      accountData: {
        login: registrationDto.login,
        email: registrationDto.email,
        passwordHash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: true,
      },
    };
    return await this.usersRepository.registration(newUser);
  }
  async login(id: mongoose.Types.ObjectId) {
    return this.jwtService.sign({ userId: id }, { secret: '12345', expiresIn: '1d' });
  }

  async validateUser(login: string, password: string) {
    const candidate = await this.usersRepository.findByLogin(login);

    if (!candidate) {
      throw new NotFoundException();
    }

    if (!candidate.emailConfirmation.isConfirmed) {
      throw new NotFoundException();
    }
    const validPassword = await bcrypt.compare(password, candidate.accountData.passwordHash);

    if (!validPassword) {
      throw new NotFoundException();
    }
    return candidate;
  }
  async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
