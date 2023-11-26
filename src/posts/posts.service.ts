import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/posts';
import { PostsRepository } from './repository';
import { Post, PostInput, UploadStatus } from 'src/schema/posts';
import { isURL } from 'class-validator';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PostService {
  postRepository: PostsRepository;
  constructor(@InjectQueue('upload') private readonly uploadQueue: Queue) {
    this.postRepository = new PostsRepository();
  }

  public async create(data: CreatePostDto): Promise<Post> {
    try {
      if (!isURL(data.coverUrl)) {
        throw new BadRequestException('url is invalid');
      }
      // 檢查資料庫當中有多少個已存在的 post，根據已存在的數量 +1，
      // 若是不存在會吐出 error，則 id 為 existPosts + 1 = 1。
      let existPosts = 0;
      try {
        existPosts = await this.postRepository.count();
      } catch (error) {}

      const postInput = new PostInput({
        coverUrl: data.coverUrl,
        status: UploadStatus.idle,
        id: existPosts + 1,
      });
      const post = await this.postRepository.create(postInput);
      return post;
    } catch (error) {
      throw error;
    }
  }

  public async list(): Promise<Post[]> {
    try {
      const result = await this.postRepository.findAll();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 將 cronjob 設定為每分鐘啟動
  @Cron('0 * * * * *')
  async setUplaodTaskInQueue() {
    try {
      // 取得所有尚未上傳的檔案

      const unPostFiles = await this.postRepository.findByStatus(
        UploadStatus.idle,
      );

      // 將檔案送進 message queue 中，並將狀態設定為 uploading，並且設定 retry 機制
      for (let i = 0; i < unPostFiles.length; i++) {
        const unPostFile = unPostFiles[i];
        await this.uploadQueue.add('upload-job', unPostFile, {
          attempts: 3,
          backoff: 10000,
        });
        await this.postRepository.update(unPostFile.id, {
          status: UploadStatus.uploading,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
