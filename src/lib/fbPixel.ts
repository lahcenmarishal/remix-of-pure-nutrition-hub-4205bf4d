// Facebook Pixel helper – thin wrapper around fbq()
// Docs: https://developers.facebook.com/docs/meta-pixel/reference

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const track = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
};

/** Fired when a user views a product page */
export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) =>
  track("ViewContent", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    content_category: product.category,
    value: product.price,
    currency: "MAD",
  });

/** Fired when a user adds a product to cart */
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) =>
  track("AddToCart", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    value: product.price * product.quantity,
    currency: "MAD",
    num_items: product.quantity,
  });

/** Fired when a user starts checkout */
export const trackInitiateCheckout = (params: {
  value: number;
  numItems: number;
}) =>
  track("InitiateCheckout", {
    value: params.value,
    currency: "MAD",
    num_items: params.numItems,
  });

/** Fired when an order is confirmed */
export const trackPurchase = (params: {
  value: number;
  orderId?: string;
  items: { id: string; quantity: number }[];
}) =>
  track("Purchase", {
    value: params.value,
    currency: "MAD",
    content_ids: params.items.map((i) => i.id),
    content_type: "product",
    num_items: params.items.reduce((s, i) => s + i.quantity, 0),
  });
