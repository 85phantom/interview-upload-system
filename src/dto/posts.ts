import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UploadStatus } from 'src/schema/posts';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  coverUrl: string;
}

export class PostDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsString()
  @IsNotEmpty()
  coverUrl: string;
  @IsString()
  imgurCoverUrl: string;
  @IsString()
  status: UploadStatus;
}
