
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url?: string;
  created_at: string;
  author_id: string;
}

interface InfoSlideshowProps {
  onArticleClick: (articleId: string) => void;
}

const InfoSlideshow: React.FC<InfoSlideshowProps> = ({ onArticleClick }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (posts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % posts.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [posts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  if (loading) {
    return (
      <Card className="h-80 animate-pulse">
        <CardContent className="h-full bg-slate-200 rounded-lg"></CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="h-80">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-slate-500">
            <h3 className="text-lg font-semibold mb-2">Belum Ada Artikel</h3>
            <p className="text-sm">Admin belum menambahkan artikel info.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPost = posts[currentSlide];

  return (
    <Card className="relative h-80 overflow-hidden cursor-pointer group" onClick={() => onArticleClick(currentPost.id)}>
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: currentPost.featured_image_url 
            ? `url(${currentPost.featured_image_url})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
        <div className="space-y-2">
          <div className="flex items-center space-x-4 text-sm opacity-90">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(currentPost.created_at).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Admin</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold leading-tight">
            {currentPost.title}
          </h3>
          
          {currentPost.excerpt && (
            <p className="text-sm opacity-90 line-clamp-2">
              {currentPost.excerpt}
            </p>
          )}
        </div>
      </CardContent>

      {posts.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {posts.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default InfoSlideshow;
