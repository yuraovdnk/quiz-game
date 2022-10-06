import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createApp } from '../src/main';
import { response } from 'express';
import { RegistrationConfirmationService } from '../src/entities/auth/auth.service';
import { Game } from '../src/entities/game/schemas/game.schema';

//desc('QuizController e2e'){
// desc(all endpoints one by one) {
//    desc(connection) {, func} => func
//    desc(myGames) { , func} > func
// }
// desc('full game flow) {it1, it2, it it iti ti it it}
// }

describe('game', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RegistrationConfirmationService)
      .useValue({
        getConfirmationStatusForNewUser() {
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const mockUser = {
    login: 'Yura',
    password: '123456',
    email: 'ovd199@gmail.com',
  };

  //TODO начать с очистки БД

  describe('connect Player', () => {
    let jwt = null;
    beforeAll(async () => {
      await request(app.getHttpServer()).delete('/pair-game-quiz/pairs/cleardb').expect(200);

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: mockUser.login,
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(204);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: mockUser.login, password: mockUser.password })
        .expect(200);
      console.log(loginResponse);
      jwt = loginResponse.body.accessToken;
    });

    //with pagination
    // it('player didnt play', async () => {
    //   await request(app.getHttpServer())
    //     .get('/pair-game-quiz/pairs/my-current')
    //     .set('Authorization', 'Bearer ' + jwt);
    //   console.log(jwt);
    //   expect(404);
    // });
    it('should connect user', async () => {
      console.log('jwt: ', jwt);
      const res = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200);

      // console.log(res.body);
      expect((res.body as Game).firstPlayer.user.login).toStrictEqual(mockUser.login);
    });
  });
  // it('my games with valid token', async () => {
  //   const res = await request(app.getHttpServer())
  //     .get('/pair-game-quiz/pairs/my')
  //     .set('Authorization', 'Bearer ' + jwt);
  //   expect(res.body.items.length).toBe(0); //Object Game
  // });
  //
  //   it('incorrect token', async () => {
  //     const res = await request(app.getHttpServer())
  //       .get('/pair-game-quiz/pairs/my')
  //       .set('Authorization', 'Bearer ' + 'df4w43423freg45gt634g.53434sdfsd');
  //     expect(res.status).toBe(401);
  //   });
  // });
  //
  // describe('my Current Games', () => {
  //   it('should get', async () => {
  //     const res = await request(app.getHttpServer())
  //       .get('/pair-game-quiz/pairs/my')
  //       .set('Authorization', 'Bearer ' + jwt);
  //     expect(res.status).toBe(404);
  //   });
  // });
  // describe('connection', () => {
  //   it('should return game with only first player', async () => {
  //     const res = await request(app.getHttpServer())
  //       .get('/pair-game-quiz/pairs/my')
  //       .set('Authorization', 'Bearer ' + jwt);
  //     expect(res.body.firtPlayer.user.login).toBe('Yura');
  //     expect(res.body.secondPlayer).toBeNull();
  //   });
  //   it('should return game with 2 players', async () => {
  //     const res = await request(app.getHttpServer())
  //       .get('/pair-game-quiz/pairs/my')
  //       .set('Authorization', 'Bearer ' + 'dfd');
  //   });
  // });
});

//toStrictEqual
//afterEach clear db
