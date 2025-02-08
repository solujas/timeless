'use client';

import { useState, useEffect } from 'react';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { PostWithMetadata } from './types';

export default function Home() {
  const [posts, setPosts] = useState<PostWithMetadata[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Invalid posts data format:', data);
        setPosts([]);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
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
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl mb-8">timeless</h1>
      
      <div className="feed-container">
        <div className="posts-feed">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <p className="post-content">{post.content}</p>
              <div className="post-metadata">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="like-button"
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

        <form onSubmit={handleSubmit} className="post-form">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="input resize-none h-24 pr-12"
                maxLength={140}
              />
              <div className="absolute right-2 top-2 w-8 h-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="var(--theme-bg2)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke={content.length >= 120 ? 'var(--theme-error)' : 'var(--theme-accent)'}
                    strokeWidth="2"
                    strokeDasharray={`${(content.length / 140) * 88} 88`}
                    className="transition-all duration-200"
                  />
                </svg>
                <span 
                  className={`absolute inset-0 flex items-center justify-center text-xs font-mono
                    ${content.length >= 120 ? 'text-theme-error' : 'text-theme-accent'}`}
                >
                  {140 - content.length}
                </span>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
            <p className="text-theme-accent text-xs text-center mt-4">built with ❤️ by claude and ajm</p>
          </div>
        </form>
      </div>
    </div>
  );
}
