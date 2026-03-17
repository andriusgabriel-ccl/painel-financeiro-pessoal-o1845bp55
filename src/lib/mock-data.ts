import { Building, CreditCard, Plane, LineChart } from 'lucide-react'

export const ENTITIES_META = {
  sp: { id: 'sp', name: 'Servidor Público', icon: Building, balance: 8500, type: 'PF' },
  mp: { id: 'mp', name: 'Milheiro Profissional', icon: CreditCard, balance: 42300.5, type: 'PF' },
  av: { id: 'av', name: 'Agência de Viagens', icon: Plane, balance: 120000, type: 'PJ' },
  mf: { id: 'mf', name: 'Mercado Financeiro', icon: LineChart, balance: 250000, type: 'PF' },
}

export type TransactionType = 'in' | 'out'
export type TransactionOrigin = 'interna' | 'externa'

export interface Transaction {
  id: string
  date: string
  description: string
  type: TransactionType
  amount: number
  category: string
  origin: TransactionOrigin
}

export const MOCK_TRANSACTIONS: Record<string, Transaction[]> = {
  sp: [
    {
      id: '1',
      date: 'Hoje',
      description: 'Salário STN',
      type: 'in',
      amount: 15000,
      category: 'salário STN',
      origin: 'externa',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Transferência para Milheiro',
      type: 'out',
      amount: 5000,
      category: 'transferência para milheiro',
      origin: 'interna',
    },
    {
      id: '3',
      date: '15 Fev',
      description: 'IRPF Retido',
      type: 'out',
      amount: 3500,
      category: 'IRPF',
      origin: 'externa',
    },
    {
      id: '4',
      date: '10 Fev',
      description: 'Auxílio Alimentação',
      type: 'in',
      amount: 1200,
      category: 'benefícios',
      origin: 'externa',
    },
  ],
  mp: [
    {
      id: '1',
      date: 'Hoje',
      description: 'Transferência Recebida',
      type: 'in',
      amount: 5000,
      category: 'transferência recebida do servidor',
      origin: 'interna',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Compra TudoAzul',
      type: 'out',
      amount: 3500,
      category: 'compra de milhas',
      origin: 'externa',
    },
    {
      id: '3',
      date: '14 Fev',
      description: 'Venda Balcão',
      type: 'in',
      amount: 2800,
      category: 'venda para agência',
      origin: 'interna',
    },
    {
      id: '4',
      date: '12 Fev',
      description: 'Pagamento Fatura Black',
      type: 'out',
      amount: 4200,
      category: 'fatura cartão',
      origin: 'externa',
    },
    {
      id: '5',
      date: '10 Fev',
      description: 'Venda Direta',
      type: 'in',
      amount: 1500,
      category: 'venda para terceiros',
      origin: 'externa',
    },
  ],
  av: [
    {
      id: '1',
      date: 'Hoje',
      description: 'Emissão Pacote Miami',
      type: 'in',
      amount: 12500,
      category: 'receita de emissões',
      origin: 'externa',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Compra Milhas MP',
      type: 'out',
      amount: 2800,
      category: 'compra de milhas do milheiro',
      origin: 'interna',
    },
    {
      id: '3',
      date: '15 Fev',
      description: 'Aluguel Sala',
      type: 'out',
      amount: 2500,
      category: 'custos operacionais',
      origin: 'externa',
    },
    {
      id: '4',
      date: '10 Fev',
      description: 'Distribuição Lucros',
      type: 'out',
      amount: 8000,
      category: 'repasse PJ para PF',
      origin: 'interna',
    },
  ],
  mf: [
    {
      id: '1',
      date: 'Hoje',
      description: 'Rendimento Tesouro',
      type: 'in',
      amount: 450,
      category: 'rendimento renda fixa',
      origin: 'externa',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Aporte Mensal',
      type: 'in',
      amount: 2000,
      category: 'aporte',
      origin: 'interna',
    },
    {
      id: '3',
      date: '16 Fev',
      description: 'Dividendos IVVB11',
      type: 'in',
      amount: 125,
      category: 'dividendos ETF',
      origin: 'externa',
    },
    {
      id: '4',
      date: '14 Fev',
      description: 'Compra BTC',
      type: 'out',
      amount: 1000,
      category: 'bitcoin',
      origin: 'externa',
    },
    {
      id: '5',
      date: '12 Fev',
      description: 'Gain Mini-Índice',
      type: 'in',
      amount: 850,
      category: 'resultado day-trade',
      origin: 'externa',
    },
    {
      id: '6',
      date: '10 Fev',
      description: 'Resgate Emergência',
      type: 'out',
      amount: 3000,
      category: 'resgate',
      origin: 'interna',
    },
  ],
}

export const generateChartData = (baseBalance: number) => {
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
