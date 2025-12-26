import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Tv, Search, Menu } from 'lucide-react';

const Navbar = ({mobileMenuOpen,setMobileMenuOpen}) => {

    const NAV_ITEMS = [
        { name: 'Home', icon: Home, page: '' },
        { name: 'Browse', icon: Compass, page: 'Browse' },
    ];

    const location=useLocation()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to={('')}
              className="flex items-center gap-2 group"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Tv className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Anime<span className="text-purple-400">Verse</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.page} to={(item.page)}>
                  <Button
                    variant="ghost"
                    className={`${
                      location.pathname === item.page
                        ? 'text-white bg-slate-800/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Desktop Search Link */}
            <div className="hidden md:flex items-center gap-3">
              <Link to={('Browse')}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700/50 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Anime
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-950 border-slate-800 w-72">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Tv className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      Anime<span className="text-purple-400">Hub</span>
                    </span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => (
                      <Link 
                        key={item.page} 
                        to={(item.page)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            location.pathname === item.page
                              ? 'text-white bg-slate-800/50'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-slate-800 pt-4">
                    <Link 
                      to={('Browse')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search Anime
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;

