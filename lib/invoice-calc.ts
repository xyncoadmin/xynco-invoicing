interface Item { quantity: number; rate: number }

export function calcInvoiceTotals(items: Item[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const subtotalRounded = Math.round(subtotal * 100) / 100
  const taxAmount = Math.round(subtotalRounded * taxRate * 100) / 100
  const total = Math.round((subtotalRounded + taxAmount) * 100) / 100
  return { subtotal: subtotalRounded, taxAmount, total }
}

export function calcItemSubtotal(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100
}
