/** Product price in dollars — keep in sync with PRODUCT_PRICE_CENTS */
export const PRODUCT_PRICE_DOLLARS = 29

/** Product price in cents (Stripe unit_amount) — derived from PRODUCT_PRICE_DOLLARS */
export const PRODUCT_PRICE_CENTS = PRODUCT_PRICE_DOLLARS * 100
