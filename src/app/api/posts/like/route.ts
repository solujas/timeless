import { NextResponse } from "next/server";
import { LikePostData } from "@/app/types";
import { getPosts, savePosts } from "@/app/lib/storage";

export async function POST(request: Request) {
  try {
    const { postId }: LikePostData = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const posts = getPosts();
    const postIndex = posts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Update the likes count
    posts[postIndex] = {
      ...posts[postIndex],
      likes: posts[postIndex].likes + 1,
    };

    savePosts(posts);

    return NextResponse.json(posts[postIndex]);
  } catch (err) {
    console.error('Failed to like post:', err);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}