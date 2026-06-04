import { calcInvoiceTotals, calcItemSubtotal } from './invoice-calc'

describe('calcInvoiceTotals', () => {
  it('returns correct subtotal with multiple items', () => {
    const items = [
      { quantity: 2, rate: 100 },
      { quantity: 1, rate: 500 },
    ]
    const result = calcInvoiceTotals(items, 0)
    expect(result.subtotal).toBe(700)
    expect(result.taxAmount).toBe(0)
    expect(result.total).toBe(700)
  })

  it('applies tax rate correctly (13% HST)', () => {
    const items = [{ quantity: 1, rate: 1000 }]
    const result = calcInvoiceTotals(items, 0.13)
    expect(result.subtotal).toBe(1000)
    expect(result.taxAmount).toBe(130)
    expect(result.total).toBe(1130)
  })

  it('handles empty items', () => {
    const result = calcInvoiceTotals([], 0)
    expect(result.subtotal).toBe(0)
    expect(result.taxAmount).toBe(0)
    expect(result.total).toBe(0)
  })

  it('rounds to 2 decimal places', () => {
    const items = [{ quantity: 1, rate: 10.005 }]
    const result = calcInvoiceTotals(items, 0)
    expect(result.subtotal).toBe(10.01)
  })
})

describe('calcItemSubtotal', () => {
  it('multiplies quantity by rate', () => {
    expect(calcItemSubtotal(3, 150)).toBe(450)
  })

  it('rounds to 2 decimal places', () => {
    expect(calcItemSubtotal(1, 99.999)).toBe(100)
  })
})
