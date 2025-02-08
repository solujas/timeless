'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { Post, PostWithMetadata } from './types';

export default function Home() {
  const [posts, setPosts] = useState<PostWithMetadata[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setContent('');
      await fetchPosts();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimeLeft = (ms: number) => {
    const duration = dayjs.duration(ms);
    const minutes = Math.floor(duration.asMinutes());
    const seconds = Math.floor(duration.asSeconds() % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gruvbox-bg0 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl text-gruvbox-fg0 mb-8 text-center">Timeless</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? (140 chars max)"
              className="input resize-none h-24"
              maxLength={140}
            />
            {error && <p className="text-gruvbox-red text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gruvbox-bg1 p-4 rounded-lg space-y-2 transition-all duration-200 hover:bg-gruvbox-bg2"
            >
              <p className="text-gruvbox-fg0">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gruvbox-fg1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="text-gruvbox-red hover:text-gruvbox-red/80 transition-colors"
                  >
                    {post.likes > 0 ? (
                      <HeartIconSolid className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                  <span>{post.likes}</span>
                </div>
                <span>{formatTimeLeft(post.timeLeft)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
