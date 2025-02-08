import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');
const POST_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Ensure data directory exists
if (!fs.existsSync(path.dirname(POSTS_FILE))) {
  fs.mkdirSync(path.dirname(POSTS_FILE), { recursive: true });
}

// Initialize posts file if it doesn't exist
if (!fs.existsSync(POSTS_FILE)) {
  fs.writeFileSync(POSTS_FILE, '[]', 'utf-8');
}

export interface Post {
  id: string;
  content: string;
  createdAt: number;
  likes: number;
}

export const getPosts = (): Post[] => {
  try {
    const data = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
};

export const savePosts = (posts: Post[]): void => {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving posts:', error);
  }
};

export const cleanExpiredPosts = (): void => {
  const posts = getPosts();
  const now = Date.now();
  const activePosts = posts.filter(post => now - post.createdAt < POST_LIFETIME);
  
  if (activePosts.length < posts.length) {
    savePosts(activePosts);
  }
};

// Start cleanup interval
setInterval(cleanExpiredPosts, 60000); // Run every minute