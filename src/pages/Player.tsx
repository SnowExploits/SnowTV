import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails, getTVShowDetails, getMovieEmbedUrl, getTVEmbedUrl } from '../services/api';

interface PlayerProps {
  type: 'movie' | 'tv';
}

export default function Player({ type }: PlayerProps) {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const [embedUrl, setEmbedUrl] = useState('');
  const [title, setTitle] = useState('');

  // Fetch movie details
  const { data: movieData, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id!).then(res => res.data),
    enabled: type === 'movie' && !!id,
  });

  // Fetch TV show details
  const { data: tvData, isLoading: isLoadingTV } = useQuery({
    queryKey: ['tv', id],
    queryFn: () => getTVShowDetails(id!).then(res => res.data),
    enabled: type === 'tv' && !!id,
  });

  useEffect(() => {
    if (type === 'movie' && id) {
      setEmbedUrl(getMovieEmbedUrl(id));
    } else if (type === 'tv' && id && season && episode) {
      setEmbedUrl(getTVEmbedUrl(id, season, episode));
    }
  }, [type, id, season, episode]);

  useEffect(() => {
    if (movieData) {
      setTitle(movieData.title);
      document.title = `${movieData.title} - SnowTV`;
    } else if (tvData) {
      const episodeTitle = `${tvData.name} - Season ${season}, Episode ${episode}`;
      setTitle(episodeTitle);
      document.title = `${episodeTitle} - SnowTV`;
    }

    return () => {
      document.title = 'SnowTV';
    };
  }, [movieData, tvData, season, episode]);

  const goBack = () => {
    navigate(-1);
  };

  if (isLoadingMovie || isLoadingTV) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button 
        onClick={goBack} 
        className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back
      </button>
      
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">{title}</h1>
      
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-xl bg-zinc-900">
        {embedUrl && (
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            title={title}
          ></iframe>
        )}
      </div>
      
      <div className="mt-6 text-center text-gray-400">
        <p>If the video doesn't load or has issues, try refreshing the page.</p>
      </div>
    </div>
  );
}
