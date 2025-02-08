import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { Post, CreatePostData } from "@/app/types";

const POSTS_KEY = "posts";
const POST_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_POSTS = 100;

export async function GET() {
  try {
    const posts = (await kv.get<Post[]>(POSTS_KEY)) || [];
    const now = Date.now();

    // Filter out expired posts and add timeLeft
    const activePosts = posts
      .filter((post) => now - post.createdAt < POST_LIFETIME)
      .map((post) => ({
        ...post,
        timeLeft: Math.max(0, POST_LIFETIME - (now - post.createdAt)),
      }));

    return NextResponse.json(activePosts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content }: CreatePostData = await request.json();

    if (!content || content.length > 140) {
      return NextResponse.json(
        { error: "Invalid post content" },
        { status: 400 }
      );
    }

    const posts = (await kv.get<Post[]>(POSTS_KEY)) || [];
    const now = Date.now();

    // Filter out expired posts
    const activePosts = posts.filter(
      (post) => now - post.createdAt < POST_LIFETIME
    );

    if (activePosts.length >= MAX_POSTS) {
      return NextResponse.json(
        { error: "Maximum post limit reached" },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: Math.random().toString(36).substring(2),
      content,
      createdAt: now,
      likes: 0,
    };

    await kv.set(POSTS_KEY, [newPost, ...activePosts]);

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}