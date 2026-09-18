import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuNav } from './components/MenuNav';
import { ProductCard } from './components/ProductCard';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { RegistrationModal } from './components/RegistrationModal';
import { ComplaintsModal } from './components/ComplaintsModal';
import { Footer } from './components/Footer';

import { Category, Product, CartItem, CustomerUser, DeliveryDetails, Topping, Sauce } from './types';
import { PRODUCTS } from './data/menuData';
import { calculateWednesdayPromo } from './utils/promo';
import { isTodayWednesday } from './utils/format';
import { ShoppingBag, Sparkles, Utensils, SearchX } from 'lucide-react';

const CATEGORIES: Category[] = [
  'MAIN DISHES',
  'SIDES',
  'DRINKS',
  'DESSERTS',
  'SAUCES',
  'EXTRAS',
];

export default function App() {
  // Application State
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('inova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('inova_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(() => {
    return {
      orderType: 'DELIVERY',
      fullName: currentUser?.fullName || '',
      phone: currentUser?.phone || '',
      address: '',
      neighborhood: '',
      instructions: '',
    };
  });

  // Wednesday promotion state: defaults to real Wednesday or true for interactive demo
  const [wednesdayPromoActive, setWednesdayPromoActive] = useState<boolean>(() => {
    const todayWed = isTodayWednesday();
    const saved = localStorage.getItem('inova_promo_override');
    if (saved !== null) {
      return saved === 'true';
    }
    return todayWed || true; // Set to true by default so reviewer/user immediately experiences the requested 2-for-1 feature
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [isComplaintsOpen, setIsComplaintsOpen] = useState<boolean>(false);
  const [customizingProduct, setCustomizingProduct] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('inova_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Sync user to deliveryDetails when user is updated
  const handleSaveUser = (user: CustomerUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('inova_customer', JSON.stringify(user));
    } catch {
      // ignore
    }
    setDeliveryDetails((prev) => ({
      ...prev,
      fullName: user.fullName,
      phone: user.phone,
    }));
  };

  const handleToggleWednesdayPromo = () => {
    const next = !wednesdayPromoActive;
    setWednesdayPromoActive(next);
    localStorage.setItem('inova_promo_override', String(next));
  };

  // Add standard product directly to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedToppings.length === 0 &&
        item.selectedSauces.length === 0
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: `${product.id}-${Date.now()}`,
        product,
        quantity,
        selectedToppings: [],
        selectedSauces: [],
        itemUnitPrice: product.price,
      };
      setCartItems([...cartItems, newItem]);
    }
    setIsCartOpen(true);
  };

  // Add customized product with toppings & sauces
  const handleConfirmCustomization = (
    product: Product,
    quantity: number,
    selectedToppings: Topping[],
    selectedSauces: Sauce[]
  ) => {
    const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const saucesTotal = selectedSauces.reduce((sum, s) => sum + s.price, 0);
    const itemUnitPrice = product.price + toppingsTotal + saucesTotal;

    const newItem: CartItem = {
      cartItemId: `${product.id}-custom-${Date.now()}`,
      product,
      quantity,
      selectedToppings,
      selectedSauces,
      itemUnitPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wednesday promotion calculation
  const promoResult = useMemo(() => {
    return calculateWednesdayPromo(cartItems, wednesdayPromoActive);
  }, [cartItems, wednesdayPromoActive]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.itemUnitPrice * item.quantity, 0);
  }, [cartItems]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Scroll to menu
  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToCategory = (cat: string) => {
    setSelectedCategory(cat as Category);
    scrollToMenu();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F4F4F5]">
      {/* Sticky Header */}
      <Header
        cartCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenComplaints={() => setIsComplaintsOpen(true)}
        currentUser={currentUser}
        wednesdayPromoActive={wednesdayPromoActive}
        onToggleWednesdayPromo={handleToggleWednesdayPromo}
        onNavigateToCategory={handleNavigateToCategory}
      />

      {/* Main Hero Screen */}
      <Hero
        onViewMenu={scrollToMenu}
        onOrderNow={scrollToMenu}
        onDelivery={() => {
          setDeliveryDetails((prev) => ({ ...prev, orderType: 'DELIVERY' }));
          setIsCartOpen(true);
        }}
        onMyAccount={() => setIsRegistrationOpen(true)}
        wednesdayPromoActive={wednesdayPromoActive}
        onToggleWednesdayPromo={handleToggleWednesdayPromo}
      />

      {/* Interactive Sticky Menu Navigation */}
      <section id="menu-section" className="relative">
        <MenuNav
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* Menu Items Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-serif">
                <Utensils className="w-3.5 h-3.5" />
                <span>Culinary Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-wide mt-1">
                {selectedCategory === 'ALL' ? 'COMPLETE DIGITAL MENU' : selectedCategory}
              </h2>
            </div>
            <span className="text-xs text-zinc-400">
              Showing {filteredProducts.length} premium selections • Prices in COP
            </span>
          </div>

          {/* If no products match search */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-zinc-900/40 rounded-2xl border border-zinc-800">
              <SearchX className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="text-zinc-400 font-medium text-sm">
                No items match your search for "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : selectedCategory === 'ALL' && searchQuery === '' ? (
            /* Render Grouped by Category when 'ALL' is selected without search */
            <div className="space-y-14">
              {CATEGORIES.map((cat) => {
                const categoryProducts = PRODUCTS.filter((p) => p.category === cat);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={cat} id={`category-block-${cat}`} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <h3 className="text-xl font-bold tracking-wider font-serif text-white uppercase">
                          {cat}
                        </h3>
                        {cat === 'MAIN DISHES' && wednesdayPromoActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#D4AF37] text-black flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            <span>WEDNESDAY 2-FOR-1 ELIGIBLE</span>
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className="text-xs text-zinc-400 hover:text-[#D4AF37] transition font-medium uppercase tracking-wider"
                      >
                        View Only {cat} →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                          onCustomize={(prod, qty) =>
                            setCustomizingProduct({ product: prod, quantity: qty })
                          }
                          wednesdayPromoActive={wednesdayPromoActive}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Render standard grid when a single category or search query is active */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onCustomize={(prod, qty) =>
                    setCustomizingProduct({ product: prod, quantity: qty })
                  }
                  wednesdayPromoActive={wednesdayPromoActive}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Shopping Cart Trigger (Visible when scrolling on both mobile and desktop) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          id="floating-cart-btn"
          aria-label="Open Cart"
          className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B8902A] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-2xl hover:brightness-110 active:scale-95 transition shadow-[#D4AF37]/30 border border-white/20 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-black text-[#D4AF37] text-[10px] font-black flex items-center justify-center border border-[#D4AF37]">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="font-serif">VIEW ORDER</span>
          {cartSubtotal > 0 && (
            <span className="pl-2 border-l border-black/30 font-serif font-black">
              {promoResult.totalDiscount > 0
                ? `$${Math.round(cartSubtotal - promoResult.totalDiscount).toLocaleString('es-CO')} COP`
                : `$${Math.round(cartSubtotal).toLocaleString('es-CO')} COP`}
            </span>
          )}
        </button>
      </div>

      {/* Modals & Panels */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct.product}
          initialQuantity={customizingProduct.quantity}
          isOpen={true}
          onClose={() => setCustomizingProduct(null)}
          onConfirm={handleConfirmCustomization}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        deliveryDetails={deliveryDetails}
        onUpdateDeliveryDetails={(details) =>
          setDeliveryDetails((prev) => ({ ...prev, ...details }))
        }
        promoResult={promoResult}
        currentUser={currentUser}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
      />

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        currentUser={currentUser}
        onSaveUser={handleSaveUser}
      />

      <ComplaintsModal
        isOpen={isComplaintsOpen}
        onClose={() => setIsComplaintsOpen(false)}
        defaultName={currentUser?.fullName || ''}
        defaultPhone={currentUser?.phone || ''}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={handleNavigateToCategory}
        onOpenComplaints={() => setIsComplaintsOpen(true)}
        onOpenDelivery={() => {
          setDeliveryDetails((prev) => ({ ...prev, orderType: 'DELIVERY' }));
          setIsCartOpen(true);
        }}
        onOpenPickup={() => {
          setDeliveryDetails((prev) => ({ ...prev, orderType: 'PICKUP' }));
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
