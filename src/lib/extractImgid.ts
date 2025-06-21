export const extractPublicId = (url: string): string | null => {
    try {
      const parts = url.split('/');
      const fileWithExt = parts[parts.length - 1]; // abc123.png
      const folder = parts[parts.length - 2];      // nextjs-posts
      const file = fileWithExt.split('.')[0];      // abc123
      return `${folder}/${file}`;
    } catch {
      return null;
    }
  };