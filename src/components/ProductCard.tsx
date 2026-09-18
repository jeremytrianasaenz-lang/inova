import React, { useState } from 'react';
import { Plus, Minus, SlidersHorizontal, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatCOP } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onCustomize: (product: Product, quantity: number) => void;
  wednesdayPromoActive: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onCustomize,
  wednesdayPromoActive,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const isMainDish = product.category === 'MAIN DISHES' || product.isMainDish;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDirectAdd = () => {
    onAddToCart(product, quantity);
  };

  const handleOpenCustomize = () => {
    onCustomize(product, quantity);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col justify-between rounded-xl bg-[#121215] border border-zinc-800/80 hover:border-[#D4AF37]/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/5"
    >
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-[4/3] bg-zinc-950 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // graceful fallback to high quality dark food plate
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-80" />

        {/* Badges: Category / Wednesday 2-for-1 Promo */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-zinc-300 border border-zinc-700/60">
            {product.category}
          </span>

          {wednesdayPromoActive && isMainDish && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-black shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>2 FOR 1</span>
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white font-serif tracking-wide group-hover:text-[#D4AF37] transition">
              {product.name}
            </h3>
          </div>

          <p className="text-xs sm:text-[13px] text-zinc-400 font-light leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-4 pt-2 border-t border-zinc-800/80">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Price</span>
            <span className="text-base sm:text-lg font-black text-[#D4AF37] font-serif">
              {formatCOP(product.price)}
            </span>
          </div>

          {/* Interactive Controls: Quantity Selector + Add / Customize */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between bg-zinc-900/90 p-1.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-medium pl-2 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:hover:bg-zinc-800 transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-7 h-7 rounded flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {isMainDish ? (
                <>
                  <button
                    type="button"
                    onClick={handleOpenCustomize}
                    className="w-full py-2.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectAdd}
                    className="w-full py-2.5 px-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-[#D4AF37]/10"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleDirectAdd}
                  className="col-span-2 w-full py-2.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-[#D4AF37]/10"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Order • {formatCOP(product.price * quantity)}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
