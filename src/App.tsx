import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Player from './pages/Player';
import MovieDetails from './pages/MovieDetails';
import TVShowDetails from './pages/TVShowDetails';
import Footer from './components/Footer';
import './index.css';

export default function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-montserrat relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Snowfall
          color="white"
          snowflakeCount={200}
          radius={[0.5, 3.0]}
          speed={[0.5, 3.0]}
          wind={[-0.5, 2.0]}
        />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TVShowDetails />} />
            <Route path="/watch/movie/:id" element={<Player type="movie" />} />
            <Route path="/watch/tv/:id/:season/:episode" element={<Player type="tv" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
