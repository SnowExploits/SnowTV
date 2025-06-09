import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getPopularMovies, searchMovies } from '../services/api';
import ContentCard from '../components/ContentCard';

export default function Movies() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // Update document title
    document.title = 'Movies - SnowTV';
    // Update search input when URL param changes
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const { data: moviesData, isLoading, error } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: async () => {
      if (searchQuery) {
        const response = await searchMovies(searchQuery, page);
        return response.data;
      } else {
        const response = await getPopularMovies(page);
        return response.data;
      }
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = searchInput ? `/movies?search=${encodeURIComponent(searchInput)}` : '/movies';
    window.history.pushState({}, '', url);
    // Force a refetch by updating the URL without a full reload
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const loadMore = () => {
    if (moviesData && moviesData.total_pages > page) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Search Results: ${searchQuery}` : 'Popular Movies'}
        </h1>
        
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input w-full md:w-64"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500">Error loading movies. Please try again later.</p>
        </div>
      ) : (
        <>
          {moviesData && moviesData.results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {moviesData.results.map((movie: any) => (
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
              
              {moviesData.total_pages > page && (
                <div className="flex justify-center mt-8">
                  <button onClick={loadMore} className="button-secondary">
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl">No movies found</p>
              {searchQuery && (
                <p className="text-gray-400 mt-2">
                  Try a different search term or browse our popular movies
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
