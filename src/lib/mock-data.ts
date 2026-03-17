import { Building, CreditCard, Plane, LineChart } from 'lucide-react'

export const ENTITIES_META = {
  sp: {
    id: 'sp',
    name: 'Servidor Público',
    icon: Building,
    balance: 8500,
    type: 'PF' as const,
    inflow: 12000,
    outflow: 3500,
  },
  mp: {
    id: 'mp',
    name: 'Milheiro Profissional',
    icon: CreditCard,
    balance: 42300.5,
    type: 'PF' as const,
    inflow: 65000,
    outflow: 22699.5,
  },
  av: {
    id: 'av',
    name: 'Agência de Viagens',
    icon: Plane,
    balance: 120000,
    type: 'PJ' as const,
    inflow: 200000,
    outflow: 80000,
  },
  mf: {
    id: 'mf',
    name: 'Mercado Financeiro',
    icon: LineChart,
    balance: 250000,
    type: 'PF' as const,
    inflow: 5000,
    outflow: 0,
  },
}

export const CATEGORIES_BY_ENTITY = {
  sp: ['Salário STN', 'IRPF', 'Benefícios', 'Transferência para Milheiro'],
  mp: [
    'Compra de Milhas',
    'Venda para Agência',
    'Venda para Terceiros',
    'Fatura Cartão',
    'Transferência Recebida',
  ],
  av: [
    'Receita de Emissões',
    'Compra de Milhas do Milheiro',
    'Custos Operacionais',
    'Repasse PJ para PF',
  ],
  mf: [
    'Aporte',
    'Resgate',
    'Rendimento Renda Fixa',
    'Dividendos ETF',
    'Resultado Day-Trade',
    'Bitcoin',
  ],
}

export const MOCK_CHART_DATA = [
  { month: 'Set', entradas: 125000, saidas: 90000 },
  { month: 'Out', entradas: 180000, saidas: 110000 },
  { month: 'Nov', entradas: 150000, saidas: 95000 },
  { month: 'Dez', entradas: 210000, saidas: 105000 },
  { month: 'Jan', entradas: 195000, saidas: 85000 },
  { month: 'Fev', entradas: 282000, saidas: 106199.5 },
]

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
      date: 'Hoje, 09:00',
      description: 'Salário STN',
      type: 'in',
      amount: 15000,
      category: 'Salário STN',
      origin: 'externa',
    },
    {
      id: '2',
      date: 'Ontem, 10:00',
      description: 'Transferência para Milheiro',
      type: 'out',
      amount: 5000,
      category: 'Transferência para Milheiro',
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
      category: 'Benefícios',
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
      category: 'Transferência Recebida',
      origin: 'interna',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Compra TudoAzul',
      type: 'out',
      amount: 3500,
      category: 'Compra de Milhas',
      origin: 'externa',
    },
    {
      id: '3',
      date: '14 Fev',
      description: 'Venda Balcão',
      type: 'in',
      amount: 2800,
      category: 'Venda para Agência',
      origin: 'interna',
    },
    {
      id: '4',
      date: '12 Fev',
      description: 'Pagamento Fatura Black',
      type: 'out',
      amount: 4200,
      category: 'Fatura Cartão',
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
      category: 'Receita de Emissões',
      origin: 'externa',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Compra Milhas MP',
      type: 'out',
      amount: 2800,
      category: 'Compra de Milhas do Milheiro',
      origin: 'interna',
    },
    {
      id: '3',
      date: '15 Fev',
      description: 'Aluguel Sala',
      type: 'out',
      amount: 2500,
      category: 'Custos Operacionais',
      origin: 'externa',
    },
    {
      id: '4',
      date: '10 Fev',
      description: 'Distribuição Lucros',
      type: 'out',
      amount: 8000,
      category: 'Repasse PJ para PF',
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
      category: 'Rendimento Renda Fixa',
      origin: 'externa',
    },
    {
      id: '2',
      date: 'Ontem',
      description: 'Aporte Mensal',
      type: 'in',
      amount: 2000,
      category: 'Aporte',
      origin: 'interna',
    },
    {
      id: '3',
      date: '16 Fev',
      description: 'Dividendos IVVB11',
      type: 'in',
      amount: 125,
      category: 'Dividendos ETF',
      origin: 'externa',
    },
    {
      id: '4',
      date: '14 Fev',
      description: 'Compra BTC',
      type: 'out',
      amount: 1000,
      category: 'Bitcoin',
      origin: 'externa',
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
