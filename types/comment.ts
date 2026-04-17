export interface PostComment {
  id: number;
  initial: string;
  avatarColor: string;
  name: string;
  text: string;
  time: string;
}

export interface OriginalPost {
  id: number;
  initial: string;
  avatarColor: string;
  name: string;
  badge: string;
  text: string;
}

export interface CommentsPageData {
  originalPost: OriginalPost;
  comments: PostComment[];
}