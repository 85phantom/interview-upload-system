export class Post {
  public id: number;
  public coverUrl: string;
  public imgurCoverUrl: string;
  public status: UploadStatus;

  constructor(data: any) {
    this.id = data.id;
    this.coverUrl = data.coverUrl;
    this.imgurCoverUrl = data.imgurCoverUrl;
    this.status = data.status;
  }
}

export enum UploadStatus {
  idle = 'IDLE',
  uploading = 'UPLOADING',
  done = 'DONE',
  error = 'ERROR',
}

export class PostInput {
  public id: number;
  public coverUrl: string;
  public status: UploadStatus;

  constructor(data: any) {
    this.id = data.id;
    this.coverUrl = data.coverUrl;
    this.status = data.status;
  }
}

export interface UpdatePost {
  imgurCoverUrl?: string;
  status?: UploadStatus;
}
