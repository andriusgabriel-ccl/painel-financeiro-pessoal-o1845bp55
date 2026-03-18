import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export interface MilesMovement {
  id: string
  data: string
  programa: string
  tipo: 'compra' | 'venda_agencia' | 'venda_terceiro' | 'transferencia' | 'expiracao'
  quantidade: number
  valor_unitario: number
  valor_total: number
}

export interface MilesConfig {
  programa: string
  preco_venda_mercado: number
}

interface MilesContextData {
  movements: MilesMovement[]
  configs: Record<string, number>
  isLoading: boolean
  addMovement: (movement: Omit<MilesMovement, 'id'>) => Promise<{ error: any }>
  deleteMovement: (id: string) => Promise<{ error: any }>
  updateConfigs: (newConfigs: MilesConfig[]) => Promise<{ error: any }>
  refreshData: () => Promise<void>
}

const MilesContext = createContext<MilesContextData | undefined>(undefined)

export function MilesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [movements, setMovements] = useState<MilesMovement[]>([])
  const [configs, setConfigs] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setIsLoading(true)

    const [movRes, confRes] = await Promise.all([
      supabase
        .from('movimentacoes_milhas')
        .select('*')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false }),
      supabase.from('configuracoes_milhas').select('*'),
    ])

    if (movRes.data) {
      setMovements(movRes.data as MilesMovement[])
    }
    if (confRes.data) {
      const confMap: Record<string, number> = {}
      confRes.data.forEach((c) => {
        confMap[c.programa] = Number(c.preco_venda_mercado)
      })
      setConfigs(confMap)
    }

    setIsLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addMovement = async (mov: Omit<MilesMovement, 'id'>) => {
    if (!user) return { error: 'No user' }
    const { data, error } = await supabase
      .from('movimentacoes_milhas')
      .insert({
        user_id: user.id,
        ...mov,
      })
      .select()

    if (data && !error) {
      setMovements((prev) =>
        [data[0] as MilesMovement, ...prev].sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
        ),
      )
    }
    return { error }
  }

  const deleteMovement = async (id: string) => {
    const { error } = await supabase.from('movimentacoes_milhas').delete().eq('id', id)
    if (!error) {
      setMovements((prev) => prev.filter((m) => m.id !== id))
    }
    return { error }
  }

  const updateConfigs = async (newConfigs: MilesConfig[]) => {
    if (!user) return { error: 'No user' }
    const payloads = newConfigs.map((c) => ({
      user_id: user.id,
      programa: c.programa,
      preco_venda_mercado: c.preco_venda_mercado,
    }))

    const { error } = await supabase
      .from('configuracoes_milhas')
      .upsert(payloads, { onConflict: 'user_id, programa' })

    if (!error) {
      setConfigs((prev) => {
        const next = { ...prev }
        newConfigs.forEach((c) => (next[c.programa] = c.preco_venda_mercado))
        return next
      })
    }
    return { error }
  }

  return (
    <MilesContext.Provider
      value={{
        movements,
        configs,
        isLoading,
        addMovement,
        deleteMovement,
        updateConfigs,
        refreshData: fetchData,
      }}
    >
      {children}
    </MilesContext.Provider>
  )
}

export const useMiles = () => {
  const context = useContext(MilesContext)
  if (context === undefined) throw new Error('useMiles must be used within a MilesProvider')
  return context
}
