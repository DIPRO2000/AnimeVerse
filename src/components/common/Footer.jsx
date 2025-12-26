import { Link } from 'react-router-dom';
import { Home, Compass, Tv } from 'lucide-react';

const Footer = () => {

    const NAV_ITEMS = [
        { name: 'Home', icon: Home, page: '' },
        { name: 'Browse', icon: Compass, page: 'Browse' },
    ];

    return (
        <footer className="bg-slate-900/50 border-t border-slate-800/50 mt-16">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Tv className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Anime<span className="text-purple-400">Verse</span>
              </span>
            </div>

            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.page}
                  to={(item.page)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <p className="text-sm text-slate-500">
              Powered by{' '}
              <a 
                href="https://jikan.moe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300"
              >
                Jikan API
              </a>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-xs text-slate-600">
              AnimeVerse is a demonstration project. All anime data is provided by MyAnimeList via Jikan API.
            </p>
          </div>
        </div>
      </footer>
    )
}

export default Footer;