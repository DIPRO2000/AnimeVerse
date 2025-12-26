import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Thriller' },
];

const SEASONS = [
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

const SCORE_RANGES = [
  { value: '9', label: '9+ Masterpiece' },
  { value: '8', label: '8+ Great' },
  { value: '7', label: '7+ Good' },
  { value: '6', label: '6+ Fine' },
];

export default function SearchFilters({ filters, onFiltersChange, onSearch }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      genre: '',
      season: '',
      year: '',
      minScore: '',
    });
    setSearchInput('');
    onSearch('');
  };

  const activeFiltersCount = [filters.genre, filters.season, filters.year, filters.minScore].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Search anime by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-12 pr-4 py-6 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              onSearch('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-3 flex-1">
          <Select
            value={filters.genre || ''}
            onValueChange={(value) => handleFilterChange('genre', value)}
          >
            <SelectTrigger className="w-[140px] bg-slate-900/50 border-slate-700/50 text-white">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {GENRES.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()} className="text-white hover:bg-slate-800">
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.season || ''}
            onValueChange={(value) => handleFilterChange('season', value)}
          >
            <SelectTrigger className="w-[130px] bg-slate-900/50 border-slate-700/50 text-white">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {SEASONS.map((season) => (
                <SelectItem key={season.value} value={season.value} className="text-white hover:bg-slate-800">
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.year || ''}
            onValueChange={(value) => handleFilterChange('year', value)}
          >
            <SelectTrigger className="w-[110px] bg-slate-900/50 border-slate-700/50 text-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 max-h-60">
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-white hover:bg-slate-800">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.minScore || ''}
            onValueChange={(value) => handleFilterChange('minScore', value)}
          >
            <SelectTrigger className="w-[150px] bg-slate-900/50 border-slate-700/50 text-white">
              <SelectValue placeholder="Min Score" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {SCORE_RANGES.map((score) => (
                <SelectItem key={score.value} value={score.value} className="text-white hover:bg-slate-800">
                  {score.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="md:hidden border-slate-700/50 bg-slate-900/50 text-white hover:bg-slate-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-purple-600 text-white">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-slate-950 border-slate-800 rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="text-white">Filter Anime</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-6">
              <Select
                value={filters.genre || ''}
                onValueChange={(value) => handleFilterChange('genre', value)}
              >
                <SelectTrigger className="w-full bg-slate-900/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {GENRES.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()} className="text-white">
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.season || ''}
                onValueChange={(value) => handleFilterChange('season', value)}
              >
                <SelectTrigger className="w-full bg-slate-900/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {SEASONS.map((season) => (
                    <SelectItem key={season.value} value={season.value} className="text-white">
                      {season.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.year || ''}
                onValueChange={(value) => handleFilterChange('year', value)}
              >
                <SelectTrigger className="w-full bg-slate-900/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 max-h-60">
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-white">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.minScore || ''}
                onValueChange={(value) => handleFilterChange('minScore', value)}
              >
                <SelectTrigger className="w-full bg-slate-900/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Minimum Score" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {SCORE_RANGES.map((score) => (
                    <SelectItem key={score.value} value={score.value} className="text-white">
                      {score.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => setIsOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Clear Filters Button */}
        {(activeFiltersCount > 0 || filters.search) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}