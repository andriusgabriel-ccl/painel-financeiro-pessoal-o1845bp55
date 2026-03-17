import { createContext, useContext, useState, ReactNode } from 'react'

interface FinanceContextData {
  isBalanceHidden: boolean
  toggleBalance: () => void
}

const FinanceContext = createContext<FinanceContextData | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)

  const toggleBalance = () => {
    setIsBalanceHidden((prev) => !prev)
  }

  return (
    <FinanceContext.Provider value={{ isBalanceHidden, toggleBalance }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
