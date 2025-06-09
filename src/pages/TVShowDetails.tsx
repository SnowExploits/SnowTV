import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Play, Star } from 'lucide-react';
import { getTVShowDetails, getTVSeasonDetails, getImageUrl, getBackdropUrl } from '../services/api';

export default function TVShowDetails() {
  const { id } = useParams();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  
  const { data: show, isLoading: isShowLoading } = useQuery({
    queryKey: ['tv', id],
    queryFn: () => getTVShowDetails(id!).then(res => res.data),
  });

  const { data: seasonData, isLoading: isSeasonLoading } = useQuery({
    queryKey: ['tv', id, 'season', selectedSeason],
    queryFn: () => getTVSeasonDetails(id!, selectedSeason.toString()).then(res => res.data),
    enabled: !!show,
  });

  if (isShowLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl">Error loading TV show details. Please try again later.</p>
        <Link to="/tv" className="button-secondary inline-block mt-6">
          <ArrowLeft size={18} className="inline mr-2" />
          Back to TV Shows
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
            src={getBackdropUrl(show.backdrop_path)} 
            alt={show.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <Link to="/tv" className="text-gray-400 hover:text-white flex items-center mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to TV Shows
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{show.name}</h1>
          {show.tagline && (
            <p className="text-xl text-gray-300 mb-4 italic">"{show.tagline}"</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {show.first_air_date && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{new Date(show.first_air_date).getFullYear()}</span>
              </div>
            )}
            {show.vote_average > 0 && (
              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
                <span>{Math.round(show.vote_average * 10) / 10}</span>
              </div>
            )}
            {show.number_of_seasons && (
              <div>
                <span>{show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-300">{show.overview}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Seasons & Episodes</h2>
            
            <div className="bg-zinc-900 rounded-lg overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer border-b border-zinc-800"
                onClick={() => setIsSeasonOpen(!isSeasonOpen)}
              >
                <span className="font-medium">Season {selectedSeason}</span>
                {isSeasonOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {isSeasonOpen && (
                <div className="p-4 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: show.number_of_seasons }, (_, i) => i + 1).map(season => (
                    <button
                      key={season}
                      onClick={() => {
                        setSelectedSeason(season);
                        setIsSeasonOpen(false);
                      }}
                      className={`py-2 px-3 rounded ${selectedSeason === season ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}
                    >
                      Season {season}
                    </button>
                  ))}
                </div>
              )}
              
              {isSeasonLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
                </div>
              ) : seasonData?.episodes ? (
                <div className="max-h-[500px] overflow-y-auto">
                  {seasonData.episodes.map((episode: any) => (
                    <Link
                      key={episode.id}
                      to={`/watch/tv/${show.id}/${selectedSeason}/${episode.episode_number}`}
                      className="p-4 flex gap-4 hover:bg-zinc-800 transition-colors border-b border-zinc-800"
                    >
                      <div className="w-24 h-16 overflow-hidden rounded flex-shrink-0">
                        <img 
                          src={episode.still_path ? getImageUrl(episode.still_path, 'w300') : getImageUrl(show.backdrop_path, 'w300')} 
                          alt={episode.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{episode.episode_number}. {episode.name}</span>
                          <Play size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">{episode.overview || 'No description available.'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No episode data available for this season.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <img 
            src={getImageUrl(show.poster_path)} 
            alt={show.name}
            className="w-full max-w-xs mx-auto rounded-lg shadow-xl"
          />
          
          {seasonData?.episodes && seasonData.episodes.length > 0 && (
            <Link 
              to={`/watch/tv/${show.id}/${selectedSeason}/1`}
              className="button-primary w-full justify-center flex items-center py-3"
            >
              <Play size={20} className="mr-2" />
              Watch Now
            </Link>
          )}
          
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <ul className="space-y-2 text-sm">
              {show.genres && (
                <li>
                  <span className="text-gray-400">Genres: </span>
                  <span>{show.genres.map((g: any) => g.name).join(', ')}</span>
                </li>
              )}
              {show.networks && show.networks.length > 0 && (
                <li>
                  <span className="text-gray-400">Network: </span>
                  <span>{show.networks.map((n: any) => n.name).join(', ')}</span>
                </li>
              )}
              {show.status && (
                <li>
                  <span className="text-gray-400">Status: </span>
                  <span>{show.status}</span>
                </li>
              )}
              {show.created_by && show.created_by.length > 0 && (
                <li>
                  <span className="text-gray-400">Created by: </span>
                  <span>{show.created_by.map((c: any) => c.name).join(', ')}</span>
                </li>
              )}
              {show.type && (
                <li>
                  <span className="text-gray-400">Type: </span>
                  <span>{show.type}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
