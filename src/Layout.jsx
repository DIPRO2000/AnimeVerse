import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Search, 
  Menu, 
  X,
  Tv,
  Github
} from 'lucide-react';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const NAV_ITEMS = [
  { name: 'Home', icon: Home, page: '' },
  { name: 'Browse', icon: Compass, page: 'Browse' },
];

export default function Layout({ currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    }

    scrollToTop();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <Navbar/>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet/>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}