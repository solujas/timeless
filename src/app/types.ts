export interface Post {
  id: string;
  content: string;
  createdAt: number;
  likes: number;
}

export interface PostWithMetadata extends Post {
  timeLeft: number;
}

export interface CreatePostData {
  content: string;
}

export interface LikePostData {
  postId: string;
}