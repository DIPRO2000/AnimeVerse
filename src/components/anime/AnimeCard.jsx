import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

export default function AnimeCard({ anime }) {
  const {
    mal_id,
    title,
    images,
    score,
    episodes,
    status,
    type
  } = anime;

  const imageUrl = images?.jpg?.large_image_url || images?.jpg?.image_url;

  return (
    <Link 
      to={(`/AnimeDetails/${mal_id}`)}
      className="group relative block overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
        
        {/* Score Badge */}
        {score && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 border border-slate-700/50">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{score.toFixed(1)}</span>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 rounded-full bg-purple-600/90 backdrop-blur-sm px-2.5 py-1">
          <span className="text-xs font-medium text-white">{type || 'TV'}</span>
        </div>
        
        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-14 w-14 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center border border-purple-400/30">
            <Play className="h-6 w-6 text-white fill-white ml-1" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            {episodes ? `${episodes} eps` : 'Ongoing'}
          </span>
          <span className="capitalize">{status?.toLowerCase() || 'Airing'}</span>
        </div>
      </div>
    </Link>
  );
}