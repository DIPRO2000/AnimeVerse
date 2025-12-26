import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Flame, Sparkles, Calendar, TrendingUp, ArrowRight } from 'lucide-react';


import AnimeGrid from '@/components/anime/AnimeGrid';
import SectionHeader from '@/components/anime/SectionHeader';
import LoadingState from '@/components/anime/LoadingState';
import ErrorState from '@/components/anime/ErrorState';
import SearchFilters from '@/components/anime/SearchFilters';
import AnimeService from '@/components/anime/AnimeService';

// Hero featured anime card component
function FeaturedAnimeCard({ anime }) {
  if (!anime) return null;
  
  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  
  return (
    <Link 
      to={('/AnimeDetails') + `?id=${anime.mal_id}`}
      className="relative group block overflow-hidden rounded-2xl h-[400px] md:h-[500px]"
    >
      <img
        src={imageUrl}
        alt={anime.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white text-xs font-medium">
              Featured
            </span>
            {anime.score && (
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                ★ {anime.score}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {anime.title}
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base line-clamp-3 mb-4 max-w-xl">
            {anime.synopsis?.slice(0, 200)}...
          </p>
          
          <div className="flex items-center gap-4 text-sm text-slate-400">
            {anime.genres?.slice(0, 3).map((genre) => (
              <span key={genre.mal_id} className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    season: '',
    year: '',
    minScore: ''
  });

  // Fetch top anime for hero section
  const { data: topAnimeData, isLoading: topLoading, error: topError, refetch: refetchTop } = useQuery({
    queryKey: ['topAnime'],
    queryFn: () => AnimeService.getTopAnime(1, 12, 'bypopularity'),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch seasonal anime
  const { data: seasonalData, isLoading: seasonalLoading, error: seasonalError, refetch: refetchSeasonal } = useQuery({
    queryKey: ['seasonalAnime'],
    queryFn: () => AnimeService.getSeasonalAnime(1, 12),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch upcoming anime
  const { data: upcomingData, isLoading: upcomingLoading, error: upcomingError, refetch: refetchUpcoming } = useQuery({
    queryKey: ['upcomingAnime'],
    queryFn: () => AnimeService.getUpcomingAnime(1, 6),
    staleTime: 5 * 60 * 1000,
  });

  // Search with filters
  const { data: searchData, isLoading: searchLoading, refetch: refetchSearch } = useQuery({
    queryKey: ['searchAnime', filters],
    queryFn: () => AnimeService.searchAnime({
      query: filters.search,
      genres: filters.genre,
      minScore: filters.minScore,
      page: 1,
      limit: 24
    }),
    enabled: !!(filters.search || filters.genre || filters.minScore),
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const isSearchActive = filters.search || filters.genre || filters.season || filters.year || filters.minScore;
  const featuredAnime = topAnimeData?.data?.[0];
  const isLoading = topLoading || seasonalLoading;
  const hasError = topError || seasonalError;

  if (isLoading && !isSearchActive) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingState fullScreen message="Loading anime database..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      {!isSearchActive && featuredAnime && (
        <div className="relative">
          <FeaturedAnimeCard anime={featuredAnime} />
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Search & Filters */}
        <div className="mb-10">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
          />
        </div>

        {/* Search Results */}
        {isSearchActive ? (
          <div className="mb-16">
            <SectionHeader
              title="Search Results"
              subtitle={searchData?.pagination?.items?.total 
                ? `Found ${searchData.pagination.items.total} anime`
                : 'Searching...'
              }
            />
            
            {searchLoading ? (
              <LoadingState message="Searching anime..." />
            ) : searchData?.data?.length > 0 ? (
              <AnimeGrid animes={searchData.data} />
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-400">No anime found matching your criteria</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Popular Anime Section */}
            <section className="mb-16">
              <SectionHeader
                title="Popular Anime"
                subtitle="Most watched and loved by the community"
                icon={Flame}
                linkTo={('Browse') + '?filter=popular'}
                linkText="View All"
              />
              
              {topError ? (
                <ErrorState message={topError.message} onRetry={refetchTop} />
              ) : (
                <AnimeGrid animes={topAnimeData?.data?.slice(1, 13)} />
              )}
            </section>

            {/* This Season Section */}
            <section className="mb-16">
              <SectionHeader
                title="This Season"
                subtitle="Currently airing anime"
                icon={Calendar}
                linkTo={('Browse') + '?filter=seasonal'}
                linkText="View All"
              />
              
              {seasonalError ? (
                <ErrorState message={seasonalError.message} onRetry={refetchSeasonal} />
              ) : (
                <AnimeGrid animes={seasonalData?.data?.slice(0, 12)} />
              )}
            </section>

            {/* Upcoming Anime Section */}
            <section className="mb-16">
              <SectionHeader
                title="Coming Soon"
                subtitle="Upcoming releases to look forward to"
                icon={Sparkles}
                linkTo={('Browse') + '?filter=upcoming'}
                linkText="View All"
              />
              
              {upcomingError ? (
                <ErrorState message={upcomingError.message} onRetry={refetchUpcoming} />
              ) : (
                <AnimeGrid animes={upcomingData?.data?.slice(0, 6)} />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}