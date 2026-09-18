import React, { useState, useId } from 'react';
import { X, Check, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { Product, Topping, Sauce } from '../types';
import { TOPPINGS, SAUCES } from '../data/menuData';
import { formatCOP } from '../utils/format';

interface CustomizationModalProps {
  product: Product;
  initialQuantity: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    quantity: number,
    selectedToppings: Topping[],
    selectedSauces: Sauce[]
  ) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  initialQuantity,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity || 1);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<Sauce[]>([]);

  // Unique IDs for accessibility
  const titleId = useId();

  if (!isOpen) return null;

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toggleSauce = (sauce: Sauce) => {
    if (selectedSauces.some((s) => s.id === sauce.id)) {
      setSelectedSauces(selectedSauces.filter((s) => s.id !== sauce.id));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  const unitToppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitSaucesTotal = selectedSauces.reduce((sum, s) => sum + s.price, 0);
  const unitPrice = product.price + unitToppingsTotal + unitSaucesTotal;
  const grandTotal = unitPrice * quantity;

  const handleConfirm = () => {
    onConfirm(product, quantity, selectedToppings, selectedSauces);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="customization-modal-container"
        className="relative w-full max-w-xl rounded-2xl bg-[#121215] border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with Product Preview */}
        <div className="relative h-44 sm:h-52 w-full bg-zinc-950 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-700/80 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-black">
                CUSTOMIZE DISH
              </span>
              <span className="text-xs text-zinc-300 font-medium font-serif">
                Base: {formatCOP(product.price)}
              </span>
            </div>
            <h2 id={titleId} className="text-2xl font-bold text-white font-serif tracking-wide">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-left">
          {/* Section: MAKE IT YOUR WAY */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div>
                <h3 className="text-sm font-black tracking-widest text-[#D4AF37] uppercase font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>MAKE IT YOUR WAY</span>
                </h3>
                <p className="text-xs text-zinc-400">Add premium artisan toppings to your main dish</p>
              </div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPPINGS.map((topping) => {
                const isSelected = selectedToppings.some((t) => t.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    type="button"
                    onClick={() => toggleTopping(topping)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-sm'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="text-xs font-bold font-serif">{topping.name}</div>
                      {topping.description && (
                        <div className="text-[11px] text-zinc-400 line-clamp-1">
                          {topping.description}
                        </div>
                      )}
                      <div className="text-xs font-bold text-[#D4AF37] mt-0.5">
                        + {formatCOP(topping.price)}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                          : 'border-zinc-600 bg-zinc-800 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: SIGNATURE DIPPING SAUCES */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
              <div>
                <h3 className="text-sm font-black tracking-widest text-[#D4AF37] uppercase font-serif">
                  SIGNATURE SAUCES
                </h3>
                <p className="text-xs text-zinc-400">Select artisan house dipping sauces</p>
              </div>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAUCES.map((sauce) => {
                const isSelected = selectedSauces.some((s) => s.id === sauce.id);
                return (
                  <button
                    key={sauce.id}
                    type="button"
                    onClick={() => toggleSauce(sauce)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-sm'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="text-xs font-bold font-serif">{sauce.name}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">{sauce.description}</div>
                      <div className="text-xs font-bold text-[#D4AF37] mt-0.5">
                        + {formatCOP(sauce.price)}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                          : 'border-zinc-600 bg-zinc-800 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: Quantity & Add Button */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4 bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-white font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total & Submit Button */}
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO ORDER • {formatCOP(grandTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
