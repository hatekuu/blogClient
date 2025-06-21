// types/post.ts
export interface Post {
  _id: string | { $oid: string };
  title: string;
  sections: {
    img_url: string;
    content: string;
  }[];
  author?: {
    id: string;
    username: string;
  };
  createdAt: string | { $date: string };
  updatedAt?: string | { $date: string }; // optional nếu có cập nhật
}
export interface PostSection {
  img_url: string;
  content: string;
}

export interface CreatePostInput {
  title: string;
  sections: PostSection[];
}
