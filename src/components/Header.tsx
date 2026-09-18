import React from 'react';
import { ShoppingBag, User, Sparkles, Phone, MessageSquareWarning } from 'lucide-react';
import { CustomerUser } from '../types';
import { formatCOP } from '../utils/format';

interface HeaderProps {
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenRegistration: () => void;
  onOpenComplaints: () => void;
  currentUser: CustomerUser | null;
  wednesdayPromoActive: boolean;
  onToggleWednesdayPromo: () => void;
  onNavigateToCategory: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenRegistration,
  onOpenComplaints,
  currentUser,
  wednesdayPromoActive,
  onToggleWednesdayPromo,
  onNavigateToCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0D]/95 backdrop-blur-md border-b border-[#27272A]/80 transition-all">
      {/* Top micro bar for Wednesday Promo simulation and quick notices */}
      <div className="bg-[#121215] border-b border-[#222226] px-4 py-1.5 text-xs text-[#A1A1AA]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 tracking-wider uppercase">
              Promo
            </span>
            <span className="text-zinc-300 font-medium">
              Wednesday 2-for-1 Special:{' '}
              <span className="text-[#D4AF37]">Buy 1 Main Dish, Get Same Item Free</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleWednesdayPromo}
              className={`flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded transition border ${
                wednesdayPromoActive
                  ? 'bg-[#D4AF37]/20 text-[#F5DEB3] border-[#D4AF37]'
                  : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
              title="Toggle Wednesday 2-for-1 promo calculation mode"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Wednesday Mode: <strong>{wednesdayPromoActive ? 'ACTIVE' : 'OFF'}</strong></span>
            </button>
            <a
              href="https://wa.me/573153921762"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-zinc-300 hover:text-[#D4AF37] transition"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span>+57 315 392 1762</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex flex-col group cursor-pointer">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white group-hover:text-[#D4AF37] transition font-serif">
            INOVA
          </span>
          <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase -mt-1 font-medium">
            International Fast Food
          </span>
        </a>

        {/* Center Quick Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm tracking-widest font-medium">
          <button
            onClick={() => onNavigateToCategory('MAIN DISHES')}
            className="text-zinc-300 hover:text-[#D4AF37] transition uppercase text-xs tracking-[0.15em]"
          >
            Menu
          </button>
          <button
            onClick={() => onNavigateToCategory('MAIN DISHES')}
            className="text-zinc-300 hover:text-[#D4AF37] transition uppercase text-xs tracking-[0.15em]"
          >
            Order Now
          </button>
          <button
            onClick={onOpenCart}
            className="text-zinc-300 hover:text-[#D4AF37] transition uppercase text-xs tracking-[0.15em]"
          >
            Delivery
          </button>
          <button
            onClick={onOpenComplaints}
            className="text-zinc-400 hover:text-[#D4AF37] transition uppercase text-xs tracking-[0.15em] flex items-center gap-1.5"
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>Claims</span>
          </button>
        </nav>

        {/* Right Action Icons: User & Shopping Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* User / My Account Button */}
          <button
            onClick={onOpenRegistration}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#D4AF37]/50 transition text-xs font-medium"
            title="My Account / Join INOVA"
          >
            <User className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">
              {currentUser ? currentUser.fullName.split(' ')[0] : 'My Account'}
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            id="header-cart-button"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#D4AF37]/10"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-black text-[#D4AF37] ml-0.5">
                {cartCount}
              </span>
            )}
            {cartSubtotal > 0 && (
              <span className="hidden md:inline pl-1 border-l border-black/30 font-bold text-[11px]">
                {formatCOP(cartSubtotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
