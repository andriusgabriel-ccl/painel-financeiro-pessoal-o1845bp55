import { startOfDay, addDays } from 'date-fns'

export type ObligationStatus = 'pago' | 'pendente' | 'atrasado'
export type ObligationType = 'payable' | 'receivable'

export interface Obligation {
  id: string
  entityId: string
  description: string
  amount: number
  dueDate: string
  status: ObligationStatus
  type: ObligationType
}

const today = startOfDay(new Date())
const dStr = (days: number) => addDays(today, days).toISOString().split('T')[0]

export const MOCK_OBLIGATIONS: Obligation[] = [
  // Servidor Público
  {
    id: 'o1',
    entityId: 'sp',
    description: 'IRPF Anual',
    amount: 3500,
    dueDate: dStr(5),
    status: 'pendente',
    type: 'payable',
  },
  {
    id: 'o2',
    entityId: 'sp',
    description: 'Conta de Água e Luz',
    amount: 280,
    dueDate: dStr(2),
    status: 'pendente',
    type: 'payable',
  },
  {
    id: 'o3',
    entityId: 'sp',
    description: 'Restituição IRPF',
    amount: 1500,
    dueDate: dStr(15),
    status: 'pendente',
    type: 'receivable',
  },
  {
    id: 'o12',
    entityId: 'sp',
    description: 'Mensalidade Clube',
    amount: 350,
    dueDate: dStr(-5),
    status: 'pago',
    type: 'payable',
  },

  // Milheiro Profissional
  {
    id: 'o4',
    entityId: 'mp',
    description: 'Fatura Cartão Azul',
    amount: 8500,
    dueDate: dStr(-1),
    status: 'atrasado',
    type: 'payable',
  },
  {
    id: 'o5',
    entityId: 'mp',
    description: 'Compra de Milhas Parcelada',
    amount: 4200,
    dueDate: dStr(10),
    status: 'pendente',
    type: 'payable',
  },
  {
    id: 'o6',
    entityId: 'mp',
    description: 'Venda Balcão (Agência)',
    amount: 2800,
    dueDate: dStr(3),
    status: 'pendente',
    type: 'receivable',
  },

  // Agência de Viagens
  {
    id: 'o7',
    entityId: 'av',
    description: 'Fornecedor Hotelaria',
    amount: 15000,
    dueDate: dStr(6),
    status: 'pendente',
    type: 'payable',
  },
  {
    id: 'o8',
    entityId: 'av',
    description: 'Custos Operacionais',
    amount: 4500,
    dueDate: dStr(20),
    status: 'pendente',
    type: 'payable',
  },
  {
    id: 'o9',
    entityId: 'av',
    description: 'Faturamento Clientes',
    amount: 22000,
    dueDate: dStr(2),
    status: 'pendente',
    type: 'receivable',
  },

  // Mercado Financeiro
  {
    id: 'o10',
    entityId: 'mf',
    description: 'Aporte Programado Renda Fixa',
    amount: 5000,
    dueDate: dStr(4),
    status: 'pendente',
    type: 'payable',
  },
  {
    id: 'o11',
    entityId: 'mf',
    description: 'Vencimento Tesouro Direto',
    amount: 12500,
    dueDate: dStr(25),
    status: 'pendente',
    type: 'receivable',
  },
]
