// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { createApp } from '../src/main';
//
// describe('game', () => {
//   jest.setTimeout(1000 * 60 * 3);
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     app = await createApp(app);
//     await app.init();
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   let jwt;
//   beforeEach(async () => {
//     const loginResponse = await request(app.getHttpServer())
//       .post('/auth/login')
//       .send({ login: 'Yura', password: '123456' })
//       .expect(201);
//     jwt = loginResponse.body;
//   });
//
//   //TODO начать с очистки БД
//
//   describe('get My all games', () => {
//     it('valid token', async () => {
//       const res = await request(app.getHttpServer())
//         .get('/pair-game-quiz/pairs/my')
//         .set('Authorization', 'Bearer ' + jwt);
//       expect(res.body.items.length).toBe(0); //Object Game
//     });
//
//     it('incorrect token', async () => {
//       const res = await request(app.getHttpServer())
//         .get('/pair-game-quiz/pairs/my')
//         .set('Authorization', 'Bearer ' + 'df4w43423freg45gt634g.53434sdfsd');
//       expect(res.status).toBe(401);
//     });
//   });
// });
//
// //toStrictEqual
// //afterEach clear db
