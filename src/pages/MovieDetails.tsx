import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, Play, Star } from 'lucide-react';
import { getMovieDetails, getImageUrl, getBackdropUrl } from '../services/api';

export default function MovieDetails() {
  const { id } = useParams();
  
  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id!).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl">Error loading movie details. Please try again later.</p>
        <Link to="/movies" className="button-secondary inline-block mt-6">
          <ArrowLeft size={18} className="inline mr-2" />
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Backdrop Image */}
      <div className="relative h-[40vh] md:h-[60vh] -mx-4 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getBackdropUrl(movie.backdrop_path)} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <Link to="/movies" className="text-gray-400 hover:text-white flex items-center mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Movies
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-xl text-gray-300 mb-4 italic">"{movie.tagline}"</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {movie.release_date && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            )}
            {movie.runtime && (
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              </div>
            )}
            {movie.vote_average > 0 && (
              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
                <span>{Math.round(movie.vote_average * 10) / 10}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-300">{movie.overview}</p>
          </div>

          {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-4">
                {movie.credits.cast.slice(0, 8).map((person: any) => (
                  <div key={person.id} className="flex flex-col items-center text-center w-20">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                      <img 
                        src={getImageUrl(person.profile_path, 'w185')} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{person.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title}
            className="w-full max-w-xs mx-auto rounded-lg shadow-xl"
          />
          
          <Link 
            to={`/watch/movie/${movie.id}`}
            className="button-primary w-full justify-center flex items-center py-3"
          >
            <Play size={20} className="mr-2" />
            Watch Now
          </Link>
          
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <ul className="space-y-2 text-sm">
              {movie.genres && (
                <li>
                  <span className="text-gray-400">Genres: </span>
                  <span>{movie.genres.map((g: any) => g.name).join(', ')}</span>
                </li>
              )}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <li>
                  <span className="text-gray-400">Studio: </span>
                  <span>{movie.production_companies[0].name}</span>
                </li>
              )}
              {movie.status && (
                <li>
                  <span className="text-gray-400">Status: </span>
                  <span>{movie.status}</span>
                </li>
              )}
              {movie.budget > 0 && (
                <li>
                  <span className="text-gray-400">Budget: </span>
                  <span>${(movie.budget / 1000000).toFixed(1)}M</span>
                </li>
              )}
              {movie.revenue > 0 && (
                <li>
                  <span className="text-gray-400">Revenue: </span>
                  <span>${(movie.revenue / 1000000).toFixed(1)}M</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
