import { createContext, useContext, useState, ReactNode } from 'react'
import { MOCK_TRANSACTIONS, ENTITIES_META, Transaction } from '@/lib/mock-data'
import { MOCK_OBLIGATIONS, Obligation } from '@/lib/mock-obligations'

export interface EntityState {
  id: string
  name: string
  icon: any
  balance: number
  type: 'PF' | 'PJ'
  inflow: number
  outflow: number
}

interface FinanceContextData {
  isBalanceHidden: boolean
  toggleBalance: () => void
  transactions: Record<string, Transaction[]>
  entities: Record<string, EntityState>
  obligations: Obligation[]
  addTransaction: (payload: any) => void
}

const FinanceContext = createContext<FinanceContextData | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>(MOCK_TRANSACTIONS)
  const [entities, setEntities] = useState<Record<string, EntityState>>(ENTITIES_META)
  const [obligations] = useState<Obligation[]>(MOCK_OBLIGATIONS)

  const toggleBalance = () => setIsBalanceHidden((prev) => !prev)

  const addTx = (entityId: string, tx: Transaction) => {
    setTransactions((prev) => ({
      ...prev,
      [entityId]: [tx, ...(prev[entityId] || [])],
    }))
    setEntities((prev) => {
      const entity = prev[entityId]
      if (!entity) return prev
      return {
        ...prev,
        [entityId]: {
          ...entity,
          balance: entity.balance + (tx.type === 'in' ? tx.amount : -tx.amount),
          inflow: entity.inflow + (tx.type === 'in' ? tx.amount : 0),
          outflow: entity.outflow + (tx.type === 'out' ? tx.amount : 0),
        },
      }
    })
  }

  const addTransaction = (payload: any) => {
    const id = Math.random().toString(36).substring(2, 9)
    if (payload.type === 'transfer') {
      const outTx: Transaction = {
        id: id + '-out',
        date: payload.date,
        description: payload.description,
        type: 'out',
        amount: payload.amount,
        category: payload.category,
        origin: 'interna',
      }
      const inTx: Transaction = {
        id: id + '-in',
        date: payload.date,
        description: payload.description,
        type: 'in',
        amount: payload.amount,
        category: payload.category,
        origin: 'interna',
      }
      addTx(payload.entityId, outTx)
      if (payload.destinationEntityId) {
        addTx(payload.destinationEntityId, inTx)
      }
    } else {
      const tx: Transaction = {
        id,
        date: payload.date,
        description: payload.description,
        type: payload.type,
        amount: payload.amount,
        category: payload.category,
        origin: 'externa',
      }
      addTx(payload.entityId, tx)
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        isBalanceHidden,
        toggleBalance,
        transactions,
        entities,
        obligations,
        addTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (context === undefined) throw new Error('useFinance must be used within a FinanceProvider')
  return context
}
