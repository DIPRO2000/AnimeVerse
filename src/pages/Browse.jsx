import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, Calendar, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AnimeGrid from '@/components/anime/AnimeGrid';
import SearchFilters from '@/components/anime/SearchFilters';
import Pagination from '@/components/anime/Pagination';
import LoadingState from '@/components/anime/LoadingState';
import ErrorState from '@/components/anime/ErrorState';
import EmptyState from '@/components/anime/EmptyState';
import AnimeService from '@/components/anime/AnimeService';

const BROWSE_MODES = {
  popular: {
    label: 'Popular',
    icon: Flame,
    fetcher: (page) => AnimeService.getTopAnime(page, 24, 'bypopularity')
  },
  trending: {
    label: 'Top Rated',
    icon: TrendingUp,
    fetcher: (page) => AnimeService.getTopAnime(page, 24, 'favorite')
  },
  seasonal: {
    label: 'This Season',
    icon: Calendar,
    fetcher: (page) => AnimeService.getSeasonalAnime(page, 24)
  },
  upcoming: {
    label: 'Upcoming',
    icon: Sparkles,
    fetcher: (page) => AnimeService.getUpcomingAnime(page, 24)
  }
};

export default function Browse() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter = urlParams.get('filter') || 'popular';
  
  const [activeMode, setActiveMode] = useState(initialFilter);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    season: '',
    year: '',
    minScore: ''
  });

  const isSearchActive = Boolean(filters.search || filters.genre || filters.minScore);

  // Fetch browse data based on mode
  const { data: browseData, isLoading: browseLoading, error: browseError, refetch: refetchBrowse } = useQuery({
    queryKey: ['browse', activeMode, page],
    queryFn: () => BROWSE_MODES[activeMode].fetcher(page),
    enabled: !isSearchActive,
    staleTime: 5 * 60 * 1000,
  });

  // Search with filters
  const { data: searchData, isLoading: searchLoading, error: searchError, refetch: refetchSearch } = useQuery({
    queryKey: ['search', filters, page],
    queryFn: () => AnimeService.searchAnime({
      query: filters.search,
      genres: filters.genre,
      minScore: filters.minScore,
      page,
      limit: 24
    }),
    enabled: isSearchActive,
    staleTime: 5 * 60 * 1000,
  });

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setPage(1);
    // Update URL without reload
    window.history.replaceState(null, '', `?filter=${mode}`);
  };

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPage(1);
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentData = isSearchActive ? searchData : browseData;
  const isLoading = isSearchActive ? searchLoading : browseLoading;
  const error = isSearchActive ? searchError : browseError;
  const refetch = isSearchActive ? refetchSearch : refetchBrowse;

  const animes = currentData?.data || [];
  const pagination = currentData?.pagination;
  const totalPages = pagination?.last_visible_page || 1;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-950/30 to-transparent pt-8 pb-4">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Browse Anime
          </h1>
          <p className="text-slate-400">
            Discover your next favorite anime from our collection
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {/* Mode Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {Object.entries(BROWSE_MODES).map(([key, mode]) => (
              <Button
                key={key}
                variant={activeMode === key && !isSearchActive ? 'default' : 'outline'}
                onClick={() => handleModeChange(key)}
                className={`${
                  activeMode === key && !isSearchActive
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                    : 'border-slate-700/50 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <mode.icon className="h-4 w-4 mr-2" />
                {mode.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
            onSearch={handleSearch}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {isSearchActive ? 'Search Results' : BROWSE_MODES[activeMode].label}
            </h2>
            {pagination?.items?.total && (
              <p className="text-sm text-slate-400 mt-1">
                {pagination.items.total.toLocaleString()} anime found
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingState message="Loading anime..." />
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} />
        ) : animes.length === 0 ? (
          <EmptyState
            title="No anime found"
            message={isSearchActive 
              ? "Try adjusting your search or filters" 
              : "No anime available in this category"
            }
          />
        ) : (
          <>
            <AnimeGrid animes={animes} />
            <Pagination
              currentPage={page}
              totalPages={Math.min(totalPages, 25)} // Jikan limits to 25 pages
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}