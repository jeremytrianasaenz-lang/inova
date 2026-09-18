import { CartItem } from '../types';

export interface PromoResult {
  isWednesdayPromoActive: boolean;
  totalDiscount: number;
  discountBreakdown: {
    productName: string;
    freeUnits: number;
    savings: number;
  }[];
  eligibleMainDishesCount: number;
}

/**
 * Calculates the Wednesday 2-for-1 promotion savings.
 * Rule: For every 2 identical main dishes, 1 base item price is free.
 * Toppings and sauces are charged separately.
 * Cannot mix different dishes to get the free item.
 */
export function calculateWednesdayPromo(
  items: CartItem[],
  promoEnabled: boolean
): PromoResult {
  if (!promoEnabled) {
    return {
      isWednesdayPromoActive: false,
      totalDiscount: 0,
      discountBreakdown: [],
      eligibleMainDishesCount: 0,
    };
  }

  // Group total quantities of each main dish across cart items
  const mainDishQuantities: Record<string, { name: string; basePrice: number; totalQty: number }> = {};
  let totalMainDishes = 0;

  for (const item of items) {
    if (item.product.category === 'MAIN DISHES' || item.product.isMainDish) {
      totalMainDishes += item.quantity;
      if (!mainDishQuantities[item.product.id]) {
        mainDishQuantities[item.product.id] = {
          name: item.product.name,
          basePrice: item.product.price,
          totalQty: 0,
        };
      }
      mainDishQuantities[item.product.id].totalQty += item.quantity;
    }
  }

  let totalDiscount = 0;
  const discountBreakdown: {
    productName: string;
    freeUnits: number;
    savings: number;
  }[] = [];

  for (const prodId of Object.keys(mainDishQuantities)) {
    const entry = mainDishQuantities[prodId];
    // For every pair of 2 of the SAME item, 1 is free
    const freeUnits = Math.floor(entry.totalQty / 2);
    if (freeUnits > 0) {
      const savings = freeUnits * entry.basePrice;
      totalDiscount += savings;
      discountBreakdown.push({
        productName: entry.name,
        freeUnits,
        savings,
      });
    }
  }

  return {
    isWednesdayPromoActive: true,
    totalDiscount,
    discountBreakdown,
    eligibleMainDishesCount: totalMainDishes,
  };
}
