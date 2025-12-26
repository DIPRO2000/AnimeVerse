import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { 
  Star, 
  Play, 
  Clock, 
  Calendar,
  Tv,
  Users,
  Heart,
  ExternalLink,
  ChevronLeft,
  Award,
  Film,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AnimeGrid from '@/components/anime/AnimeGrid';
import LoadingState from '@/components/anime/LoadingState';
import ErrorState from '@/components/anime/ErrorState';
import AnimeService from '@/components/anime/AnimeService';

// Info item component
function InfoItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
      <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-white font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// Character card component
function CharacterCard({ character }) {
  const charData = character.character;
  const voiceActor = character.voice_actors?.find(va => va.language === 'Japanese');
  
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-purple-500/30 transition-colors">
      <img
        src={charData.images?.jpg?.image_url}
        alt={charData.name}
        className="h-16 w-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm truncate">{charData.name}</p>
        <p className="text-xs text-slate-400 capitalize">{character.role}</p>
        {voiceActor && (
          <p className="text-xs text-purple-400 mt-1 truncate">
            VA: {voiceActor.person.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AnimeDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const { id } = useParams();
  const animeId = id;

  // Fetch anime details
  const { data: animeData, isLoading, error, refetch } = useQuery({
    queryKey: ['animeDetails', animeId],
    queryFn: () => AnimeService.getAnimeById(animeId),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch characters
  const { data: charactersData } = useQuery({
    queryKey: ['animeCharacters', animeId],
    queryFn: () => AnimeService.getAnimeCharacters(animeId),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ['animeRecommendations', animeId],
    queryFn: () => AnimeService.getAnimeRecommendations(animeId),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000,
  });

  if (!animeId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <ErrorState message="No anime ID provided" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingState fullScreen message="Loading anime details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <ErrorState 
          fullScreen 
          message={error.message} 
          onRetry={refetch} 
        />
      </div>
    );
  }

  const anime = animeData?.data;
  if (!anime) return null;

  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const trailerUrl = anime.trailer?.embed_url;
  const recommendations = recommendationsData?.data?.slice(0, 6).map(rec => rec.entry) || [];
  const characters = charactersData?.data?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={imageUrl}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link to={('/')}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm text-white hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 -mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Poster */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
                <img
                  src={imageUrl}
                  alt={anime.title}
                  className="w-full aspect-[3/4] object-cover"
                />
                {anime.score && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 border border-slate-700/50">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-base font-bold text-white">{anime.score}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-3">
                {trailerUrl && (
                  <a 
                    href={trailerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Play className="h-4 w-4 mr-2 fill-white" />
                      Watch Trailer
                    </Button>
                  </a>
                )}
                {anime.url && (
                  <a 
                    href={anime.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-700/50 bg-slate-900/50 text-white hover:bg-slate-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on MAL
                    </Button>
                  </a>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 text-center">
                  <p className="text-2xl font-bold text-white">{anime.rank || '—'}</p>
                  <p className="text-xs text-slate-400">Rank</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 text-center">
                  <p className="text-2xl font-bold text-white">{anime.popularity || '—'}</p>
                  <p className="text-xs text-slate-400">Popularity</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 text-center">
                  <p className="text-2xl font-bold text-white">{anime.members ? (anime.members / 1000).toFixed(0) + 'K' : '—'}</p>
                  <p className="text-xs text-slate-400">Members</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 text-center">
                  <p className="text-2xl font-bold text-white">{anime.favorites ? (anime.favorites / 1000).toFixed(0) + 'K' : '—'}</p>
                  <p className="text-xs text-slate-400">Favorites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1 pb-16">
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-lg text-slate-400 mb-3">{anime.title_english}</p>
              )}
              {anime.title_japanese && (
                <p className="text-sm text-slate-500">{anime.title_japanese}</p>
              )}
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mt-4">
                {anime.genres?.map((genre) => (
                  <Badge 
                    key={genre.mal_id}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 bg-purple-500/10"
                  >
                    {genre.name}
                  </Badge>
                ))}
                {anime.themes?.map((theme) => (
                  <Badge 
                    key={theme.mal_id}
                    variant="outline"
                    className="border-slate-600/50 text-slate-300"
                  >
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 mb-6">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="characters"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Characters
                </TabsTrigger>
                <TabsTrigger 
                  value="related"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Related
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Synopsis */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Synopsis</h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {anime.synopsis || 'No synopsis available.'}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem icon={Tv} label="Type" value={anime.type} />
                  <InfoItem icon={Play} label="Episodes" value={anime.episodes || 'Ongoing'} />
                  <InfoItem icon={Clock} label="Duration" value={anime.duration} />
                  <InfoItem icon={Calendar} label="Aired" value={anime.aired?.string} />
                  <InfoItem icon={Award} label="Status" value={anime.status} />
                  <InfoItem icon={Film} label="Source" value={anime.source} />
                  <InfoItem icon={Star} label="Rating" value={anime.rating} />
                  <InfoItem 
                    icon={Building2} 
                    label="Studios" 
                    value={anime.studios?.map(s => s.name).join(', ')} 
                  />
                </div>

                {/* Background */}
                {anime.background && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Background</h2>
                    <p className="text-slate-400 leading-relaxed">
                      {anime.background}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="characters">
                {characters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {characters.map((char) => (
                      <CharacterCard key={char.character.mal_id} character={char} />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No character data available.</p>
                )}
              </TabsContent>

              <TabsContent value="related">
                {anime.relations?.length > 0 ? (
                  <div className="space-y-6">
                    {anime.relations.map((relation, index) => (
                      <div key={index}>
                        <h3 className="text-sm font-medium text-purple-400 mb-3">{relation.relation}</h3>
                        <div className="flex flex-wrap gap-2">
                          {relation.entry.map((entry) => (
                            <Link 
                              key={entry.mal_id}
                              to={entry.type === 'anime' ? ('AnimeDetails') + `?id=${entry.mal_id}` : '#'}
                              className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-white text-sm hover:border-purple-500/50 transition-colors"
                            >
                              {entry.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No related anime available.</p>
                )}
              </TabsContent>
            </Tabs>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-semibold text-white mb-6">Recommendations</h2>
                <AnimeGrid animes={recommendations} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}