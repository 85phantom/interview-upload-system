import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { BullModule } from '@nestjs/bull';
import { PostConsumer } from './postsConsumer';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    BullModule.registerQueueAsync({ name: 'upload' }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostConsumer],
})
export class PostsModule {}
