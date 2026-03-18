import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export interface CreditCard {
  id: string
  entidade_id: string
  nome: string
  limite_total: number
  melhor_dia_compra: number
  dia_vencimento: number
}

export interface CardTransaction {
  id: string
  cartao_id: string
  categoria_id: string | null
  data: string
  descricao: string
  valor: number
  parcela_atual: number
  total_parcelas: number
}

export interface Category {
  id: string
  entidade_id: string
  nome: string
}

interface CardsContextData {
  cards: CreditCard[]
  transactions: CardTransaction[]
  categories: Category[]
  addCard: (card: Omit<CreditCard, 'id'>) => Promise<void>
  addCardTransactions: (txs: Omit<CardTransaction, 'id'>[]) => Promise<void>
  refreshData: () => Promise<void>
  isLoading: boolean
}

const CardsContext = createContext<CardsContextData | undefined>(undefined)

export function CardsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cards, setCards] = useState<CreditCard[]>([])
  const [transactions, setTransactions] = useState<CardTransaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setIsLoading(true)

    const [cardsRes, txsRes, catRes] = await Promise.all([
      supabase.from('cartoes').select('*').order('created_at'),
      supabase.from('lancamentos_cartao').select('*').order('data', { ascending: false }),
      supabase.from('categorias').select('*'),
    ])

    if (cardsRes.data) setCards(cardsRes.data as CreditCard[])
    if (txsRes.data) setTransactions(txsRes.data as CardTransaction[])
    if (catRes.data) setCategories(catRes.data as Category[])

    setIsLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addCard = async (payload: Omit<CreditCard, 'id'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('cartoes')
      .insert({ ...payload, user_id: user.id })
      .select()

    if (data && !error) {
      setCards((prev) => [...prev, data[0] as CreditCard])
    }
  }

  const addCardTransactions = async (payloads: Omit<CardTransaction, 'id'>[]) => {
    if (!user) return
    const inserts = payloads.map((p) => ({ ...p, user_id: user.id }))
    const { data, error } = await supabase.from('lancamentos_cartao').insert(inserts).select()

    if (data && !error) {
      setTransactions((prev) =>
        [...data, ...prev].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
      )
    }
  }

  return (
    <CardsContext.Provider
      value={{
        cards,
        transactions,
        categories,
        addCard,
        addCardTransactions,
        refreshData: fetchData,
        isLoading,
      }}
    >
      {children}
    </CardsContext.Provider>
  )
}

export const useCards = () => {
  const context = useContext(CardsContext)
  if (context === undefined) throw new Error('useCards must be used within a CardsProvider')
  return context
}
