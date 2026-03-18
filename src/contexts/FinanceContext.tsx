import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Building, CreditCard, Plane, LineChart, CircleDashed } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Transaction {
  id: string
  entityId: string
  date: string
  rawDate: string
  description: string
  type: 'in' | 'out'
  originalType: 'in' | 'out' | 'transfer'
  amount: number
  category: string
  origin: string
  notes?: string
  destinationEntityId?: string
}

export interface Obligation {
  id: string
  entityId: string
  description: string
  amount: number
  dueDate: string
  status: 'pago' | 'pendente' | 'atrasado'
  type: 'payable' | 'receivable'
}

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
  isLoading: boolean
  isBalanceHidden: boolean
  toggleBalance: () => void
  transactions: Record<string, Transaction[]>
  entities: Record<string, EntityState>
  obligations: Obligation[]
  addTransaction: (payload: any) => Promise<void>
  editTransaction: (id: string, payload: any) => Promise<{ error: any }>
  deleteTransaction: (id: string) => Promise<{ error: any }>
  importTransactions: (payloads: any[]) => Promise<{ error: any; count?: number }>
  deleteObligation: (id: string) => Promise<{ error: any }>
  categoriesByEntity: Record<string, string[]>
  chartData: any[]
  monthlyVariation: { percentage: string; isPositive: boolean }
  refreshData: () => void
}

const FinanceContext = createContext<FinanceContextData | undefined>(undefined)

const iconMap: Record<string, any> = {
  Building,
  CreditCard,
  Plane,
  LineChart,
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [entitiesData, setEntitiesData] = useState<any[]>([])
  const [categoriesData, setCategoriesData] = useState<any[]>([])
  const [transactionsData, setTransactionsData] = useState<any[]>([])
  const [obligationsData, setObligationsData] = useState<any[]>([])

  const toggleBalance = () => setIsBalanceHidden((prev) => !prev)

  const fetchData = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    const [entRes, catRes, lanRes, obrRes] = await Promise.all([
      supabase.from('entidades').select('*').order('created_at'),
      supabase.from('categorias').select('*'),
      supabase.from('lancamentos').select('*').order('data', { ascending: false }),
      supabase.from('obrigacoes').select('*'),
    ])
    if (entRes.data) setEntitiesData(entRes.data)
    if (catRes.data) setCategoriesData(catRes.data)
    if (lanRes.data) setTransactionsData(lanRes.data)
    if (obrRes.data) setObligationsData(obrRes.data)
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const entities = useMemo(() => {
    const result: Record<string, EntityState> = {}
    entitiesData.forEach((e) => {
      const txs = transactionsData.filter((t) => t.entidade_id === e.id)
      const inflow = txs.filter((t) => t.tipo === 'in').reduce((acc, t) => acc + Number(t.valor), 0)
      const outflow = txs
        .filter((t) => t.tipo === 'out')
        .reduce((acc, t) => acc + Number(t.valor), 0)

      const destTxs = transactionsData.filter(
        (t) => t.entidade_destino_id === e.id && t.tipo === 'transfer',
      )
      const transferIn = destTxs.reduce((acc, t) => acc + Number(t.valor), 0)
      const transferOut = txs
        .filter((t) => t.tipo === 'transfer')
        .reduce((acc, t) => acc + Number(t.valor), 0)

      result[e.id] = {
        id: e.id,
        name: e.nome,
        icon: iconMap[e.icon_name] || CircleDashed,
        type: e.tipo,
        inflow: inflow + transferIn,
        outflow: outflow + transferOut,
        balance: inflow + transferIn - outflow - transferOut,
      }
    })
    return result
  }, [entitiesData, transactionsData])

  const transactions = useMemo(() => {
    const result: Record<string, Transaction[]> = {}
    transactionsData.forEach((t) => {
      const catName = categoriesData.find((c) => c.id === t.categoria_id)?.nome || 'Sem Categoria'
      const dateStr = format(parseISO(t.data), 'dd MMM', { locale: ptBR })

      if (!result[t.entidade_id]) result[t.entidade_id] = []

      if (t.tipo === 'transfer') {
        result[t.entidade_id].push({
          id: t.id + '-out',
          entityId: t.entidade_id,
          date: dateStr,
          rawDate: t.data,
          description: t.descricao,
          type: 'out',
          originalType: 'transfer',
          amount: Number(t.valor),
          category: catName,
          origin: t.origem,
          notes: t.observacoes || undefined,
          destinationEntityId: t.entidade_destino_id || undefined,
        })
        if (t.entidade_destino_id) {
          if (!result[t.entidade_destino_id]) result[t.entidade_destino_id] = []
          result[t.entidade_destino_id].push({
            id: t.id + '-in',
            entityId: t.entidade_destino_id,
            date: dateStr,
            rawDate: t.data,
            description: t.descricao,
            type: 'in',
            originalType: 'transfer',
            amount: Number(t.valor),
            category: catName,
            origin: t.origem,
            notes: t.observacoes || undefined,
            destinationEntityId: t.entidade_destino_id || undefined,
          })
        }
      } else {
        result[t.entidade_id].push({
          id: t.id,
          entityId: t.entidade_id,
          date: dateStr,
          rawDate: t.data,
          description: t.descricao,
          type: t.tipo as 'in' | 'out',
          originalType: t.tipo as 'in' | 'out',
          amount: Number(t.valor),
          category: catName,
          origin: t.origem,
          notes: t.observacoes || undefined,
          destinationEntityId: undefined,
        })
      }
    })
    return result
  }, [transactionsData, categoriesData])

  const obligations = useMemo(() => {
    return obligationsData.map((o) => ({
      id: o.id,
      entityId: o.entidade_id,
      description: o.descricao,
      amount: Number(o.valor),
      dueDate: o.vencimento,
      status: o.status,
      type: o.tipo,
    }))
  }, [obligationsData])

  const categoriesByEntity = useMemo(() => {
    const map: Record<string, string[]> = {}
    categoriesData.forEach((c) => {
      if (!map[c.entidade_id]) map[c.entidade_id] = []
      map[c.entidade_id].push(c.nome)
    })
    return map
  }, [categoriesData])

  const chartData = useMemo(() => {
    const months: any[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      months.push({
        month: format(d, 'MMM', { locale: ptBR }),
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        entradas: 0,
        saidas: 0,
      })
    }

    transactionsData.forEach((t) => {
      const d = parseISO(t.data)
      const m = months.find((m) => m.monthNum === d.getMonth() && m.year === d.getFullYear())
      if (m) {
        if (t.tipo === 'in') m.entradas += Number(t.valor)
        if (t.tipo === 'out') m.saidas += Number(t.valor)
      }
    })

    return months.map((m) => ({
      month: m.month.charAt(0).toUpperCase() + m.month.slice(1),
      entradas: m.entradas,
      saidas: m.saidas,
    }))
  }, [transactionsData])

  const monthlyVariation = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    let currentBalance = 0
    let prevBalance = 0

    transactionsData.forEach((t) => {
      if (t.tipo === 'transfer') return
      const d = parseISO(t.data)
      const val = Number(t.valor)
      const isCurrent = d.getMonth() === currentMonth && d.getFullYear() === currentYear
      const isPrev = d.getMonth() === prevMonth && d.getFullYear() === prevYear

      if (isCurrent) currentBalance += t.tipo === 'in' ? val : -val
      if (isPrev) prevBalance += t.tipo === 'in' ? val : -val
    })

    if (prevBalance === 0) {
      if (currentBalance === 0) return { percentage: '0.0', isPositive: true }
      return { percentage: '100.0', isPositive: currentBalance > 0 }
    }
    const variation = ((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100
    return {
      percentage: Math.abs(variation).toFixed(1),
      isPositive: variation >= 0,
    }
  }, [transactionsData])

  const addTransaction = async (payload: any) => {
    if (!user) return
    const cat = categoriesData.find(
      (c) => c.entidade_id === payload.entityId && c.nome === payload.category,
    )

    const { data, error } = await supabase
      .from('lancamentos')
      .insert({
        user_id: user.id,
        entidade_id: payload.entityId,
        data: payload.date,
        tipo: payload.type,
        valor: payload.amount,
        categoria_id: cat?.id || null,
        descricao: payload.description,
        observacoes: payload.notes || null,
        entidade_destino_id: payload.destinationEntityId || null,
        origem: payload.type === 'transfer' ? 'interna' : 'externa',
      })
      .select()

    if (data && !error) {
      setTransactionsData((prev) => [data[0], ...prev])
    }
  }

  const editTransaction = async (id: string, payload: any) => {
    if (!user) return { error: 'No user' }
    const cat = categoriesData.find(
      (c) => c.entidade_id === payload.entityId && c.nome === payload.category,
    )

    const realId = id.replace('-in', '').replace('-out', '')

    const { error } = await supabase
      .from('lancamentos')
      .update({
        entidade_id: payload.entityId,
        data: payload.date,
        tipo: payload.type,
        valor: payload.amount,
        categoria_id: cat?.id || null,
        descricao: payload.description,
        observacoes: payload.notes || null,
        entidade_destino_id: payload.destinationEntityId || null,
        origem: payload.type === 'transfer' ? 'interna' : 'externa',
      })
      .eq('id', realId)

    if (!error) {
      fetchData()
    }
    return { error }
  }

  const importTransactions = async (payloads: any[]) => {
    if (!user) return { error: 'No user' }

    const inserts = payloads.map((p) => {
      const cat = categoriesData.find((c) => c.entidade_id === p.entityId && c.nome === p.category)
      return {
        user_id: user.id,
        entidade_id: p.entityId,
        data: p.date,
        descricao: p.description,
        valor: p.amount,
        tipo: p.type,
        origem: 'externa',
        categoria_id: cat?.id || null,
      }
    })

    const { error } = await supabase.from('lancamentos').insert(inserts)
    if (!error) {
      fetchData()
    }
    return { error, count: inserts.length }
  }

  const deleteTransaction = async (id: string) => {
    const realId = id.replace('-in', '').replace('-out', '')
    const { error } = await supabase.from('lancamentos').delete().eq('id', realId)
    if (!error) {
      setTransactionsData((prev) => prev.filter((t) => t.id !== realId))
    }
    return { error }
  }

  const deleteObligation = async (id: string) => {
    const { error } = await supabase.from('obrigacoes').delete().eq('id', id)
    if (!error) {
      setObligationsData((prev) => prev.filter((o) => o.id !== id))
    }
    return { error }
  }

  return (
    <FinanceContext.Provider
      value={{
        isLoading,
        isBalanceHidden,
        toggleBalance,
        transactions,
        entities,
        obligations,
        addTransaction,
        editTransaction,
        deleteTransaction,
        importTransactions,
        deleteObligation,
        categoriesByEntity,
        chartData,
        monthlyVariation,
        refreshData: fetchData,
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
