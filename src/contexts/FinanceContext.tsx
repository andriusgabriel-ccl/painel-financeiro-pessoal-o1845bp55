import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Building, CreditCard, Plane, LineChart, CircleDashed } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Transaction {
  id: string
  date: string
  description: string
  type: 'in' | 'out'
  amount: number
  category: string
  origin: string
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
  isBalanceHidden: boolean
  toggleBalance: () => void
  transactions: Record<string, Transaction[]>
  entities: Record<string, EntityState>
  obligations: Obligation[]
  addTransaction: (payload: any) => Promise<void>
  categoriesByEntity: Record<string, string[]>
  chartData: any[]
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
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [entitiesData, setEntitiesData] = useState<any[]>([])
  const [categoriesData, setCategoriesData] = useState<any[]>([])
  const [transactionsData, setTransactionsData] = useState<any[]>([])
  const [obligationsData, setObligationsData] = useState<any[]>([])

  const toggleBalance = () => setIsBalanceHidden((prev) => !prev)

  const fetchData = async () => {
    if (!user) return
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
  }

  useEffect(() => {
    fetchData()
  }, [user])

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
          date: dateStr,
          description: t.descricao,
          type: 'out',
          amount: Number(t.valor),
          category: catName,
          origin: t.origem,
        })
        if (t.entidade_destino_id) {
          if (!result[t.entidade_destino_id]) result[t.entidade_destino_id] = []
          result[t.entidade_destino_id].push({
            id: t.id + '-in',
            date: dateStr,
            description: t.descricao,
            type: 'in',
            amount: Number(t.valor),
            category: catName,
            origin: t.origem,
          })
        }
      } else {
        result[t.entidade_id].push({
          id: t.id,
          date: dateStr,
          description: t.descricao,
          type: t.tipo as 'in' | 'out',
          amount: Number(t.valor),
          category: catName,
          origin: t.origem,
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

  return (
    <FinanceContext.Provider
      value={{
        isBalanceHidden,
        toggleBalance,
        transactions,
        entities,
        obligations,
        addTransaction,
        categoriesByEntity,
        chartData,
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
