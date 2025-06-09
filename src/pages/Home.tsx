import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { 
  getTrendingMovies, 
  getTrendingTVShows, 
  getPopularMovies, 
  getPopularTVShows,
  getBackdropUrl
} from '../services/api';
import ContentCard from '../components/ContentCard';

export default function Home() {
  const [heroMovie, setHeroMovie] = useState<any>(null);
  
  const { data: trendingMovies } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: async () => {
      const response = await getTrendingMovies();
      return response.data.results;
    }
  });

  const { data: trendingTVShows } = useQuery({
    queryKey: ['trendingTVShows'],
    queryFn: async () => {
      const response = await getTrendingTVShows();
      return response.data.results;
    }
  });

  const { data: popularMovies } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: async () => {
      const response = await getPopularMovies();
      return response.data.results;
    }
  });

  const { data: popularTVShows } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: async () => {
      const response = await getPopularTVShows();
      return response.data.results;
    }
  });

  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      // Pick a random movie from trending for the hero section
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingMovies.length));
      setHeroMovie(trendingMovies[randomIndex]);
    }
  }, [trendingMovies]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={getBackdropUrl(heroMovie.backdrop_path)} 
              alt={heroMovie.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          <div className="relative py-20 px-6 md:px-12 flex flex-col justify-center min-h-[500px]">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 max-w-2xl">
              {heroMovie.title}
            </h1>
            <p className="text-gray-300 mb-6 max-w-xl line-clamp-3">
              {heroMovie.overview}
            </p>
            <div>
              <NavLink to={`/movie/${heroMovie.id}`} className="button-primary inline-flex items-center">
                Watch Now
                <ChevronRight size={18} className="ml-1" />
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* Trending Movies */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trending Movies</h2>
          <NavLink to="/movies" className="text-sm text-gray-400 hover:text-white flex items-center">
            View All <ChevronRight size={16} />
          </NavLink>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {trendingMovies?.slice(0, 6).map((movie: any) => (
            <ContentCard 
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              releaseDate={movie.release_date}
              type="movie"
            />
          ))}
        </div>
      </section>

      {/* Trending TV Shows */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trending TV Shows</h2>
          <NavLink to="/tv" className="text-sm text-gray-400 hover:text-white flex items-center">
            View All <ChevronRight size={16} />
          </NavLink>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {trendingTVShows?.slice(0, 6).map((show: any) => (
            <ContentCard 
              key={show.id}
              id={show.id}
              title={show.name}
              posterPath={show.poster_path}
              rating={show.vote_average}
              releaseDate={show.first_air_date}
              type="tv"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
