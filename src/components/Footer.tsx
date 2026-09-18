import React from 'react';
import { Phone, MapPin, Clock, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onOpenComplaints: () => void;
  onOpenDelivery: () => void;
  onOpenPickup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenComplaints,
  onOpenDelivery,
  onOpenPickup,
}) => {
  return (
    <footer className="w-full bg-[#070709] border-t border-zinc-800/80 text-zinc-400 pt-14 pb-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold tracking-[0.25em] text-white font-serif">
                INOVA
              </span>
              <span className="text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase font-medium">
                International Fast Food
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-sm">
              International fast food elevated to culinary sophistication. Handcrafted gourmet recipes made with fire-grilled meats, artisan buns, and secret house emulsions.
            </p>

            <div className="space-y-2 text-xs pt-1 text-zinc-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Carrera 11 # 84-09, Zona Rosa, Bogotá, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Monday to Sunday: 11:30 AM — 11:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-semibold text-white">WhatsApp: +57 315 392 1762</span>
              </div>
            </div>
          </div>

          {/* MENU Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-serif">
              MENU
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('MAIN DISHES')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Main Dishes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('SIDES')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Sides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('DRINKS')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Drinks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('DESSERTS')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Desserts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('SAUCES')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Sauces
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('EXTRAS')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Extras
                </button>
              </li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-serif">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenComplaints}
                  className="hover:text-white transition cursor-pointer text-left text-zinc-300 font-medium"
                >
                  Complaints & Claims (PQRS)
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/573153921762"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <span className="text-zinc-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-500">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* ORDER Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] font-serif">
              ORDER
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDelivery}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPickup}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Pickup
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/573153921762"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5 text-[#25D366] font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp (+57 315 392 1762)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-zinc-500">
            © {new Date().getFullYear()} INOVA International Fast Food. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="#social-instagram"
              className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 transition border border-zinc-800"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#social-facebook"
              className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 transition border border-zinc-800"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#social-twitter"
              className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 transition border border-zinc-800"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
