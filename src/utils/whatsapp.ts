import { CartItem, DeliveryDetails } from '../types';
import { formatCOP } from './format';
import { PromoResult } from './promo';

export const WHATSAPP_PHONE = '573153921762';
export const WHATSAPP_DISPLAY = '+57 315 392 1762';

export function generateWhatsAppMessage(
  cartItems: CartItem[],
  delivery: DeliveryDetails,
  subtotal: number,
  deliveryFee: number,
  promoResult: PromoResult,
  total: number
): string {
  const isDelivery = delivery.orderType === 'DELIVERY';

  let msg = `*INOVA ORDER*\n`;
  msg += `------------------------------------\n`;
  msg += `*Customer:* ${delivery.fullName || 'Valued Guest'}\n`;
  msg += `*Phone:* ${delivery.phone || 'Not specified'}\n`;
  msg += `*Order Type:* ${delivery.orderType}\n`;

  if (isDelivery) {
    msg += `*Address:* ${delivery.address || 'Address not provided'}\n`;
    if (delivery.neighborhood) {
      msg += `*Neighborhood:* ${delivery.neighborhood}\n`;
    }
    if (delivery.instructions) {
      msg += `*Instructions:* ${delivery.instructions}\n`;
    }
  } else {
    msg += `*Pickup Location:* INOVA Flagship (Carrera 11 # 84-09, Bogotá)\n`;
  }

  msg += `------------------------------------\n`;
  msg += `*ORDER DETAILS:*\n\n`;

  cartItems.forEach((item, index) => {
    const itemTotal = item.itemUnitPrice * item.quantity;
    msg += `${index + 1}. *${item.quantity}x ${item.product.name}*\n`;
    
    if (item.selectedToppings.length > 0) {
      const toppingsList = item.selectedToppings
        .map((t) => `${t.name} (+${formatCOP(t.price)})`)
        .join(', ');
      msg += `   • Toppings: ${toppingsList}\n`;
    }

    if (item.selectedSauces.length > 0) {
      const saucesList = item.selectedSauces
        .map((s) => `${s.name} (+${formatCOP(s.price)})`)
        .join(', ');
      msg += `   • Sauces: ${saucesList}\n`;
    }

    msg += `   • Item Price: ${formatCOP(itemTotal)}\n\n`;
  });

  msg += `------------------------------------\n`;
  msg += `*Subtotal:* ${formatCOP(subtotal)}\n`;

  if (promoResult.totalDiscount > 0) {
    msg += `*Wednesday 2-for-1 Special:* -${formatCOP(promoResult.totalDiscount)}\n`;
    promoResult.discountBreakdown.forEach((b) => {
      msg += `   (Promo: ${b.freeUnits}x free ${b.productName})\n`;
    });
  }

  if (isDelivery) {
    msg += `*Delivery Fee:* ${formatCOP(deliveryFee)}\n`;
  } else {
    msg += `*Pickup:* $0 COP\n`;
  }

  msg += `*TOTAL:* ${formatCOP(total)}\n`;
  msg += `------------------------------------\n`;
  msg += `Sent via INOVA Digital Ordering System`;

  return msg;
}

export function generateWhatsAppUrl(
  cartItems: CartItem[],
  delivery: DeliveryDetails,
  subtotal: number,
  deliveryFee: number,
  promoResult: PromoResult,
  total: number
): string {
  const text = generateWhatsAppMessage(
    cartItems,
    delivery,
    subtotal,
    deliveryFee,
    promoResult,
    total
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
