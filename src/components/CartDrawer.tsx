import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  Sparkles,
  Send,
  UserPlus,
  AlertCircle,
  MapPin,
  FileText
} from 'lucide-react';
import { CartItem, DeliveryDetails, CustomerUser } from '../types';
import { PromoResult } from '../utils/promo';
import { formatCOP } from '../utils/format';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  deliveryDetails: DeliveryDetails;
  onUpdateDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
  promoResult: PromoResult;
  currentUser: CustomerUser | null;
  onOpenRegistration: () => void;
}

const DELIVERY_FEE_COP = 6000;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  deliveryDetails,
  onUpdateDeliveryDetails,
  promoResult,
  currentUser,
  onOpenRegistration,
}) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.itemUnitPrice * item.quantity,
    0
  );
  const deliveryFee = deliveryDetails.orderType === 'DELIVERY' && cartItems.length > 0 ? DELIVERY_FEE_COP : 0;
  const grandTotal = Math.max(0, subtotal - promoResult.totalDiscount + deliveryFee);

  const validateOrder = (): boolean => {
    const errors: Record<string, string> = {};
    if (!deliveryDetails.fullName.trim()) {
      errors.fullName = 'Please provide your full name.';
    }
    if (!deliveryDetails.phone.trim()) {
      errors.phone = 'Please provide your contact phone number.';
    }
    if (deliveryDetails.orderType === 'DELIVERY') {
      if (!deliveryDetails.address.trim()) {
        errors.address = 'Please provide your delivery address.';
      }
      if (!deliveryDetails.neighborhood.trim()) {
        errors.neighborhood = 'Please specify your neighborhood/barrio.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendToWhatsApp = () => {
    if (cartItems.length === 0) return;
    if (!validateOrder()) {
      const firstError = document.getElementById('cart-form-container');
      firstError?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const url = generateWhatsAppUrl(
      cartItems,
      deliveryDetails,
      subtotal,
      deliveryFee,
      promoResult,
      grandTotal
    );

    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-panel-container"
          className="w-screen max-w-md bg-[#101013] border-l border-zinc-800 text-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider font-serif text-white">
                YOUR ORDER
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37] text-black">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content: Items & Delivery Details */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                  <Truck className="w-8 h-8" />
                </div>
                <p className="text-zinc-400 font-medium">Your shopping cart is empty.</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 rounded-lg bg-zinc-800 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider hover:bg-zinc-700 transition"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Selected Items
                  </div>

                  {cartItems.map((item) => {
                    const itemTotal = item.itemUnitPrice * item.quantity;
                    return (
                      <div
                        key={item.cartItemId}
                        className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-white font-serif">
                              {item.product.name}
                            </h4>
                            <div className="text-xs text-[#D4AF37] font-medium font-serif mt-0.5">
                              {formatCOP(item.itemUnitPrice)} each
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected Toppings */}
                        {item.selectedToppings.length > 0 && (
                          <div className="text-[11px] text-zinc-400 bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800/80">
                            <span className="text-[#D4AF37] font-semibold">Toppings: </span>
                            {item.selectedToppings
                              .map((t) => `${t.name} (+${formatCOP(t.price)})`)
                              .join(', ')}
                          </div>
                        )}

                        {/* Selected Sauces */}
                        {item.selectedSauces.length > 0 && (
                          <div className="text-[11px] text-zinc-400 bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800/80">
                            <span className="text-[#D4AF37] font-semibold">Sauces: </span>
                            {item.selectedSauces
                              .map((s) => `${s.name} (+${formatCOP(s.price)})`)
                              .join(', ')}
                          </div>
                        )}

                        {/* Quantity controls and item subtotal */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/70">
                          <div className="flex items-center gap-2 bg-zinc-800/80 px-2 py-1 rounded-md border border-zinc-700/60">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-zinc-300 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-white w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-zinc-300 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-black text-white font-serif">
                            {formatCOP(itemTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Option Switcher */}
                <div id="cart-form-container" className="space-y-3 pt-2">
                  <div className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Fulfillment Method
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateDeliveryDetails({ orderType: 'DELIVERY' })}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        deliveryDetails.orderType === 'DELIVERY'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateDeliveryDetails({ orderType: 'PICKUP' })}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        deliveryDetails.orderType === 'PICKUP'
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Pick Up at INOVA</span>
                    </button>
                  </div>

                  {/* Customer Information Form */}
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {deliveryDetails.orderType === 'DELIVERY' ? 'ORDER FOR DELIVERY' : 'PICKUP DETAILS'}
                      </span>
                      {!currentUser && (
                        <button
                          type="button"
                          onClick={onOpenRegistration}
                          className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Quick Register</span>
                        </button>
                      )}
                    </div>

                    {deliveryDetails.orderType === 'PICKUP' && (
                      <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>INOVA Flagship Store</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Carrera 11 # 84-09, Zona Rosa, Bogotá. Your order will be ready for pickup in 20-30 minutes.
                        </p>
                      </div>
                    )}

                    {/* Customer Name */}
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.fullName}
                        onChange={(e) =>
                          onUpdateDeliveryDetails({ fullName: e.target.value })
                        }
                        placeholder="e.g. Jeremy Triana"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                      />
                      {formErrors.fullName && (
                        <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Customer Phone */}
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={deliveryDetails.phone}
                        onChange={(e) =>
                          onUpdateDeliveryDetails({ phone: e.target.value })
                        }
                        placeholder="e.g. 315 392 1762"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Delivery-Only Fields */}
                    {deliveryDetails.orderType === 'DELIVERY' && (
                      <>
                        <div>
                          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                            Address *
                          </label>
                          <input
                            type="text"
                            value={deliveryDetails.address}
                            onChange={(e) =>
                              onUpdateDeliveryDetails({ address: e.target.value })
                            }
                            placeholder="e.g. Calle 93 # 12-45, Apt 402"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                          />
                          {formErrors.address && (
                            <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {formErrors.address}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                            Neighborhood / Sector *
                          </label>
                          <input
                            type="text"
                            value={deliveryDetails.neighborhood}
                            onChange={(e) =>
                              onUpdateDeliveryDetails({ neighborhood: e.target.value })
                            }
                            placeholder="e.g. Chicó Norte / Chapinero"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                          />
                          {formErrors.neighborhood && (
                            <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {formErrors.neighborhood}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                            Additional Delivery Instructions
                          </label>
                          <input
                            type="text"
                            value={deliveryDetails.instructions}
                            onChange={(e) =>
                              onUpdateDeliveryDetails({ instructions: e.target.value })
                            }
                            placeholder="e.g. Ring buzzer 402, leave with concierge"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Summary & WhatsApp Button */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-zinc-950 border-t border-zinc-800 space-y-3 shrink-0">
              {/* Promo Banner if Wednesday discount applied */}
              {promoResult.totalDiscount > 0 && (
                <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#F5DEB3] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Wednesday 2-for-1 Special Applied</span>
                  </span>
                  <span className="font-extrabold text-[#D4AF37] font-serif">
                    -{formatCOP(promoResult.totalDiscount)}
                  </span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400 uppercase tracking-wider">Subtotal</span>
                  <span className="font-serif font-bold text-white">{formatCOP(subtotal)}</span>
                </div>

                {promoResult.totalDiscount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span className="uppercase tracking-wider">Wednesday Discount</span>
                    <span className="font-serif font-bold">-{formatCOP(promoResult.totalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-400 uppercase tracking-wider">Delivery Fee</span>
                  <span className="font-serif font-bold text-white">
                    {deliveryDetails.orderType === 'DELIVERY'
                      ? formatCOP(deliveryFee)
                      : '$0 COP (Pickup)'}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm">
                  <span className="font-bold text-white uppercase tracking-wider font-serif">
                    TOTAL
                  </span>
                  <span className="font-extrabold text-base text-[#D4AF37] font-serif">
                    {formatCOP(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Prominent WhatsApp Ordering Button */}
              <button
                type="button"
                id="cart-order-whatsapp-btn"
                onClick={handleSendToWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] via-[#20BA5A] to-[#1EAA52] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>ORDER VIA WHATSAPP</span>
              </button>

              <div className="text-center">
                <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                  <FileText className="w-3 h-3" />
                  Sends preformatted order directly to +57 315 392 1762
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
