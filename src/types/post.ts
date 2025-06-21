// types/post.ts
export interface Post {
  _id: string | { $oid: string };
  title: string;
  content: string;
  img_url_list?: string[];
  author?: { userId: string; username: string };
  createdAt: string | { $date: string };
}