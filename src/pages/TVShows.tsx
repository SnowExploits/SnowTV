import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getPopularTVShows, searchTVShows } from '../services/api';
import ContentCard from '../components/ContentCard';

export default function TVShows() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // Update document title
    document.title = 'TV Shows - SnowTV';
    // Update search input when URL param changes
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const { data: tvShowsData, isLoading, error } = useQuery({
    queryKey: ['tvshows', searchQuery, page],
    queryFn: async () => {
      if (searchQuery) {
        const response = await searchTVShows(searchQuery, page);
        return response.data;
      } else {
        const response = await getPopularTVShows(page);
        return response.data;
      }
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = searchInput ? `/tv?search=${encodeURIComponent(searchInput)}` : '/tv';
    window.history.pushState({}, '', url);
    // Force a refetch by updating the URL without a full reload
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const loadMore = () => {
    if (tvShowsData && tvShowsData.total_pages > page) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Search Results: ${searchQuery}` : 'Popular TV Shows'}
        </h1>
        
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search TV shows..."
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
          <p className="text-red-500">Error loading TV shows. Please try again later.</p>
        </div>
      ) : (
        <>
          {tvShowsData && tvShowsData.results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tvShowsData.results.map((show: any) => (
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
              
              {tvShowsData.total_pages > page && (
                <div className="flex justify-center mt-8">
                  <button onClick={loadMore} className="button-secondary">
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl">No TV shows found</p>
              {searchQuery && (
                <p className="text-gray-400 mt-2">
                  Try a different search term or browse our popular TV shows
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
