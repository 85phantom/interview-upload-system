import { UpdatePost, Post, PostInput, UploadStatus } from 'src/schema/posts';
import db from '../db';

export class PostsRepository {
  private uploadPath: string;

  constructor() {
    this.uploadPath = '/uplaod';
  }

  public async create(postInput: PostInput): Promise<Post> {
    const createUplaodPath = this.uploadPath.concat('[]');
    await db.push(createUplaodPath, postInput);
    const result = await this.findById(postInput.id);
    return result;
  }

  public async findAll(): Promise<Post[]> {
    const postList = (await db.getData(this.uploadPath)) as Array<any>;
    return postList.map((upladFile) => new Post(upladFile));
  }

  public async findByStatus(status: UploadStatus): Promise<Post[]> {
    const postList = await db.filter(this.uploadPath, function (value) {
      if (value.status == status) {
        return true;
      }
      return false;
    });

    return postList.map((post) => new Post(post));
  }

  public async findById(id: number): Promise<Post> {
    // 從指定的路徑取出資料
    const index = await db.getIndex(this.uploadPath, id, 'id');
    if (index == -1) return;
    const findPath = this.uploadPath.concat('[', index.toString(), ']');
    const post = await db.getData(findPath);
    return post;
  }

  public async count(): Promise<number> {
    const count = await db.count(this.uploadPath);
    return count;
  }

  public async update(id: number, data: UpdatePost) {
    const index = await db.getIndex(this.uploadPath, id, 'id');
    if (index == -1) return;
    const updatePath = this.uploadPath.concat('[', index.toString(), ']');
    const posts = await db.getData(updatePath);

    if (data.status) posts.status = data.status;
    if (data.imgurCoverUrl) posts.imgurCoverUrl = data.imgurCoverUrl;
    await db.push(updatePath, posts);
  }
}
