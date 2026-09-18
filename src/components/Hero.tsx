import React from 'react';
import { ArrowDown, Flame, Sparkles, Truck, Utensils, UserCheck, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onViewMenu: () => void;
  onOrderNow: () => void;
  onDelivery: () => void;
  onMyAccount: () => void;
  wednesdayPromoActive: boolean;
  onToggleWednesdayPromo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onViewMenu,
  onOrderNow,
  onDelivery,
  onMyAccount,
  wednesdayPromoActive,
  onToggleWednesdayPromo,
}) => {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#0B0B0D] pt-8 pb-14 border-b border-[#222226]">
      {/* Background subtle radial lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Brand Identity & Call To Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-[#D4AF37]/30 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gourmet Street Craft • Bogotá, Colombia</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-serif leading-[1.05]">
                INOVA
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-[#D4AF37] tracking-[0.2em] uppercase font-serif font-medium">
                International Fast Food
              </p>
            </div>

            <p className="text-zinc-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Experience the pinnacle of international fast food. Handcrafted prime-cut burgers, Tokyo-style katsu sandos, authentic artisan choripán, and crisp loaded sides crafted with Michelin-level culinary standards.
            </p>

            {/* Action Buttons: VIEW MENU, ORDER NOW, DELIVERY, MY ACCOUNT */}
            <div className="w-full pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onViewMenu}
                id="hero-view-menu-btn"
                className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8902A] text-black font-bold text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer"
              >
                <span>VIEW MENU</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOrderNow}
                id="hero-order-now-btn"
                className="px-5 py-3.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-white font-semibold text-sm tracking-wider uppercase hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-[#D4AF37]" />
                <span>ORDER NOW</span>
              </button>

              <button
                onClick={onDelivery}
                id="hero-delivery-btn"
                className="px-5 py-3.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-white font-semibold text-sm tracking-wider uppercase hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>DELIVERY</span>
              </button>

              <button
                onClick={onMyAccount}
                id="hero-my-account-btn"
                className="px-5 py-3.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white font-semibold text-sm tracking-wider uppercase hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>MY ACCOUNT</span>
              </button>
            </div>

            {/* Quality badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-400 border-t border-zinc-800/80 w-full">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 100% Certified Angus Beef
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D4AF37]" /> Open Fire Grilled Daily
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#D4AF37]" /> Rapid Temperature Controlled Delivery
              </span>
            </div>
          </div>

          {/* Right Column: Realistic Food Photography Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 group">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85"
                alt="INOVA Classic Gourmet Cheeseburger"
                className="w-full h-80 sm:h-96 object-cover object-center transform group-hover:scale-105 transition duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Floating food feature tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/85 backdrop-blur-md border border-zinc-700/70 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    Signature Selection
                  </span>
                  <span className="text-sm font-bold text-white">$28.000 COP</span>
                </div>
                <h2 className="text-base font-bold text-white font-serif">Classic Cheeseburger</h2>
                <p className="text-xs text-zinc-400 line-clamp-1">
                  Double beef patty, aged cheddar, pickles & INOVA secret smoked sauce.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sophisticated Subtle Promotional Banner: WEDNESDAY SPECIAL (2 FOR 1) */}
        <div className="mt-10 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-zinc-950 via-[#141418] to-zinc-950 border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#D4AF37] text-black font-extrabold text-[11px] uppercase tracking-wider">
                  WEDNESDAY SPECIAL
                </span>
                <span className="text-lg font-black text-[#D4AF37] tracking-wider uppercase font-serif">
                  2 FOR 1 — EAT 2 — PAY FOR 1
                </span>
              </div>
              <p className="text-sm sm:text-base font-medium text-white">
                "Buy 1 main dish and get a second dish of the <span className="text-[#D4AF37] underline decoration-[#D4AF37]/50 underline-offset-4 font-bold">SAME ITEM FREE</span>."
              </p>
              <div className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-zinc-800/80">
                <strong className="text-[#D4AF37]">Promotion Rules:</strong> Valid every Wednesday on selected main dishes. Promotion applies exclusively when both dishes are <em>exactly the same product</em>. Example: If you order <strong>2 Classic Cheeseburgers</strong>, you only pay for <strong>1 Classic Cheeseburger</strong> ($28.000 COP savings). The promotion does <em>NOT</em> allow mixing different dishes. Toppings and additional sauces are charged separately.
              </div>
            </div>

            {/* Interactive Toggle for Wednesday Testing */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                <span className="text-xs text-zinc-300">Wednesday Promo:</span>
                <button
                  onClick={onToggleWednesdayPromo}
                  className={`px-3 py-1 rounded text-xs font-bold transition tracking-wider ${
                    wednesdayPromoActive
                      ? 'bg-[#D4AF37] text-black shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {wednesdayPromoActive ? 'APPLIED (2-FOR-1)' : 'ACTIVATE FOR TEST'}
                </button>
              </div>
              <span className="text-[11px] text-zinc-400 italic">
                {wednesdayPromoActive
                  ? 'Active in cart! Add 2 matching main dishes to save.'
                  : 'Toggle to simulate live Wednesday discount.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
