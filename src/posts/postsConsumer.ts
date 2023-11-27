import { Process, Processor } from '@nestjs/bull';
import axios from 'axios';
import { Job } from 'bull';
import { Post, UploadStatus } from 'src/schema/posts';
import { PostsRepository } from './repository';
import { ConfigService } from '@nestjs/config';

//message queue consumer
@Processor('upload')
export class PostConsumer {
  private postRepository: PostsRepository;

  constructor(private configService: ConfigService) {
    this.postRepository = new PostsRepository();
  }
  // decorator
  @Process('upload-job')
  async postsToImgur(job: Job<Post>) {
    const post = job.data as Post;

    try {
      const response = await axios.get(post.coverUrl, {
        responseType: 'arraybuffer',
      });

      try {
        const clientId = this.configService.get<string>('imgur.clientId');
        const options = {
          method: 'POST',
          url: 'https://api.imgur.com/3/image',
          headers: {
            Authorization: 'Client-ID '.concat(clientId),
          },
          data: response.data,
        };
        const result = await axios(options);
        // 上傳資料成功時，狀態設定為 done 並更新 imgurCoverUrl
        await this.postRepository.update(post.id, {
          imgurCoverUrl: result.data.data.link,
          status: UploadStatus.done,
        });
      } catch (error) {
        // 上傳資料失敗時，狀態設定為 error
        await this.postRepository.update(post.id, {
          status: UploadStatus.error,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
