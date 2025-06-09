import { NavLink } from 'react-router-dom';
import { Calendar, Star } from 'lucide-react';
import { getImageUrl } from '../services/api';

interface ContentCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  releaseDate?: string;
  type: 'movie' | 'tv';
}

export default function ContentCard({ id, title, posterPath, rating, releaseDate, type }: ContentCardProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const roundedRating = Math.round(rating * 10) / 10;
  
  return (
    <NavLink 
      to={`/${type}/${id}`} 
      className="content-card group flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img 
          src={getImageUrl(posterPath)} 
          alt={title}
          className="w-full h-auto aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-2 text-sm">
            {roundedRating > 0 && (
              <div className="flex items-center">
                <Star size={14} className="mr-1 text-yellow-400 fill-yellow-400" />
                <span>{roundedRating}</span>
              </div>
            )}
            {year && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{year}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
      </div>
    </NavLink>
  );
}
