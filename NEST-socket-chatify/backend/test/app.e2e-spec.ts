import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL_TEST);
    (await mongoose.connection.db.dropDatabase())
      ? console.log('Database Dropped')
      : console.log('Database not dropped');
  });

  const user = {
    email: 'test@gmail.com',
    password: '123456',
    userName: 'test',
    imageUrl: 'imageUrl will be here',
  };

  const notification = {
    recieverId: '5f9d7f3b3f3b9b001f3f3b9b',
    senderId: '60a0b6b3b3f3b9b001f3f3b9b',
    text: 'Hello',
    userName: 'test',
    type: 'friendRequest',
    createdAt: Date.now(),
  };

  const conversation = {
    senderId: '5f9d7f3b3f3b9b001f3f3b9b',
    recieverId: '60a0b6b3b3f3b9b001f3f3b9b',
  };

  let token: string = '';
  let notificationCreated: any;
  let newConversation: any;
  let newMessage: any;

  describe('Register new User', () => {
    it('(POST) - /user/signUp', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/signUp')
        .send(user)
        .expect(201);
      expect(response.body.message).toEqual('User Created Successfully!');
    });
  });

  describe('Login User', () => {
    it('(POST) - /auth/signin', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .then((res) => {
          token = res.body.access_token;
          expect(res.body.access_token).toBeDefined();
        });
    });
  });

  describe('Get profile of a user', () => {
    it('(GET) - /auth/profile', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.body.message).toEqual('Profile');
        });
    });
  });

  describe('Create a new notification', () => {
    it('(POST) - /notification/createNotification', async () => {
      await request(app.getHttpServer())
        .post('/notification/createNotification')
        .set('Authorization', `Bearer ${token}`)
        .send(notification)
        .expect(201)
        .then((res) => {
          expect(res.body.message).toEqual(
            'Notification Created Successfully!',
          );
          notificationCreated = res.body.newNotification;
        });
    });
  });

  describe('Get notification of a user', () => {
    it('(GET) - /notification/getNotification', async () => {
      await request(app.getHttpServer())
        .get(`/notification/getNotification/${notificationCreated.recieverId}`)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Delete notification of a user', () => {
    it('(DELETE) - /notification/deleteNotification', async () => {
      await request(app.getHttpServer())
        .delete(`/notification/deleteNotification/${notificationCreated._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.message).toEqual(
            'Notification Deleted Successfully!',
          );
        });
    });
  });

  describe('Create conversation', () => {
    it('(POST) - /conversation/createConversation', async () => {
      await request(app.getHttpServer())
        .post('/conversation/createConversation')
        .send(conversation)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .then((res) => {
          newConversation = res.body.createConversation;
          expect(res.body.message).toEqual(
            'Conversation Created Successfully!',
          );
        });
    });
  });

  describe('Get all conversations of a user', () => {
    it('(GET) - /conversation/getAllConversationsByUserId/', async () => {
      await request(app.getHttpServer())
        .get(
          `/conversation/getAllConversationsByUserId/${conversation.senderId}`,
        )
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Get the conversation by conversationId', () => {
    it('(Get) - /conversation/getConversationByConvoId/', async () => {
      await request(app.getHttpServer())
        .get(`/conversation/getConversationByConvoId/${newConversation._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body._id).toEqual(newConversation._id);
        });
    });
  });

  describe('Get the conversation by members', () => {
    it('(Get) - /conversation/getConversationByMembers/', async () => {
      await request(app.getHttpServer())
        .get(`/conversation/getConversationByMembers/${conversation.senderId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.message).toEqual('Conversation Found!');
        });
    });
  });

  describe('Create Message', () => {
    it('(POST) - /message/createMessage', async () => {
      const message = {
        senderId: conversation.senderId,
        receiverId: conversation.recieverId,
        conversationId: newConversation._id,
        message: 'Hello',
      };
      await request(app.getHttpServer())
        .post('/message/createMessage')
        .send(message)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .then((res) => {
          newMessage = res.body.newMessage;
          expect(res.body.message).toEqual('Message Created Successfully!');
        });
    });
  });

  describe('Get messages by conversationId', () => {
    it('(GET) - /message/getMessages/', async () => {
      await request(app.getHttpServer())
        .get(`/message/getMessages/${newConversation._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  afterAll(async () => {
    await mongoose.connection
      .close()
      .then(() => console.log('MongoDB Connection Closed'));
    await app.close();
  });
});
