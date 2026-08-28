/**
 * WhatsApp Direct 1-Click Order Link Generator
 */
export function generateWhatsAppOrderUrl(product, quantity = 1, selectedWeight = null, customNote = '') {
  const whatsappNumber = localStorage.getItem('shree_whatsapp_number') || '919876543210';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const weight = selectedWeight || product.weight || 'Standard Pack';
  const totalPrice = (product.price || 0) * quantity;
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shreeshyampureorganic.com';

  const message = `🌿 *NEW ORDER INQUIRY - SHREE SHYAM PURE ORGANIC* 🌿
----------------------------------------
*Product:* ${product.name}
*Category:* ${product.category || 'Organic'}
*Selected Pack:* ${weight}
*Quantity:* ${quantity}
*Total Amount:* ₹${totalPrice}
${customNote ? `*Note:* ${customNote}\n` : ''}
*Product Link:* ${currentUrl}/#product-${product.id}
----------------------------------------
Namaste! I would like to place an order for this pure organic item. Please confirm availability and payment details.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * General WhatsApp Contact Link Generator
 */
export function generateWhatsAppGeneralContactUrl(customMessage = '') {
  const whatsappNumber = localStorage.getItem('shree_whatsapp_number') || '919876543210';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const defaultMsg = customMessage || 'Namaste Shree Shyam Pure Organic team! I have a question regarding your natural organic products.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMsg)}`;
}
