/* General utility functions (exposes cn) */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateChartData(baseBalance: number) {
  const data = []
  let current = baseBalance * 0.8
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    current += (Math.random() - 0.4) * (baseBalance * 0.05)
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      balance: Math.max(0, current),
    })
  }
  data[data.length - 1].balance = baseBalance
  return data
}
