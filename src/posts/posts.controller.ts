import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto } from 'src/dto/posts';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('')
  @HttpCode(200)
  async createPost(@Body() post: CreatePostDto) {
    const result = await this.postService.create(post);
    return result;
  }

  @Get('')
  @HttpCode(200)
  async findAllPost() {
    const result = await this.postService.list();
    return result;
  }
}
