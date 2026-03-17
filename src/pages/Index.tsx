import { useFinance } from '@/contexts/FinanceContext'
import {
  Building,
  CreditCard,
  Plane,
  LineChart,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { EntityCard, EntityData } from '@/components/EntityCard'
import { formatCurrency, formatCompactCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const MOCK_ENTITIES: EntityData[] = [
  {
    id: 'sp',
    name: 'Servidor Público',
    type: 'PF',
    icon: Building,
    balance: 8500,
    inflow: 12000,
    outflow: 3500,
  },
  {
    id: 'mp',
    name: 'Milheiro Profissional',
    type: 'PF',
    icon: CreditCard,
    balance: 42300.5,
    inflow: 65000,
    outflow: 22699.5,
  },
  {
    id: 'av',
    name: 'Agência de Viagens',
    type: 'PJ',
    icon: Plane,
    balance: 120000,
    inflow: 200000,
    outflow: 80000,
  },
  {
    id: 'mf',
    name: 'Mercado Financeiro',
    type: 'PF',
    icon: LineChart,
    balance: 250000,
    inflow: 5000,
    outflow: 0,
  },
]

const MOCK_CHART_DATA = [
  { month: 'Set', entradas: 125000, saidas: 90000 },
  { month: 'Out', entradas: 180000, saidas: 110000 },
  { month: 'Nov', entradas: 150000, saidas: 95000 },
  { month: 'Dez', entradas: 210000, saidas: 105000 },
  { month: 'Jan', entradas: 195000, saidas: 85000 },
  { month: 'Fev', entradas: 282000, saidas: 106199.5 },
]

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    title: 'Salário Servidor',
    entity: 'Servidor Público',
    amount: 12000,
    type: 'in',
    date: 'Hoje, 09:00',
  },
  {
    id: 2,
    title: 'Venda de Milhas',
    entity: 'Milheiro Profissional',
    amount: 5400,
    type: 'in',
    date: 'Ontem, 14:30',
  },
  {
    id: 3,
    title: 'Fornecedor Aéreos',
    entity: 'Agência de Viagens',
    amount: 15000,
    type: 'out',
    date: 'Ontem, 10:15',
  },
  {
    id: 4,
    title: 'Dividendos FIIs',
    entity: 'Mercado Financeiro',
    amount: 1250,
    type: 'in',
    date: '12 Fev, 11:00',
  },
  {
    id: 5,
    title: 'Assinaturas Múltiplas',
    entity: 'Milheiro Profissional',
    amount: 890.5,
    type: 'out',
    date: '10 Fev, 08:45',
  },
]

const chartConfig = {
  entradas: { label: 'Entradas', color: 'hsl(var(--chart-1))' },
  saidas: { label: 'Saídas', color: 'hsl(var(--chart-2))' },
}

export default function Index() {
  const { isBalanceHidden } = useFinance()
  const totalBalance = MOCK_ENTITIES.reduce((acc, curr) => acc + curr.balance, 0)

  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 shadow-lg animate-fade-in-up">
        <div className="absolute inset-0 bg-primary/5 opacity-50 mix-blend-overlay"></div>
        <CardContent className="p-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium uppercase tracking-wider">
                Saldo Total Consolidado
              </h2>
            </div>
            <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground tabular-nums drop-shadow-sm">
              {formatCurrency(totalBalance, isBalanceHidden)}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-4 py-2 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Variação Mensal</span>
              <span className="text-sm font-bold text-emerald-500">+12.4%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_ENTITIES.map((entity, index) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            isBalanceHidden={isBalanceHidden}
            styleDelay={index * 100}
          />
        ))}
      </div>

      <div
        className="grid gap-6 lg:grid-cols-7 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <Card className="lg:col-span-4 border-border/40 bg-card/40">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Fluxo de Caixa Consolidado</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_CHART_DATA}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
                            <p className="mb-2 font-medium">{payload[0].payload.month}</p>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-muted-foreground">{entry.name}:</span>
                                <span className="font-semibold tabular-nums">
                                  {formatCurrency(entry.value as number, isBalanceHidden)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="entradas"
                    fill="var(--color-entradas)"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="saidas"
                    fill="var(--color-saidas)"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/40 bg-card/40 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 px-4 pb-4">
            <div className="space-y-5">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border',
                        tx.type === 'in'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-500',
                      )}
                    >
                      {tx.type === 'in' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">{tx.title}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {tx.entity} • {tx.date}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      tx.type === 'in' ? 'text-emerald-500' : 'text-rose-500',
                    )}
                  >
                    {tx.type === 'in' ? '+' : '-'} {formatCurrency(tx.amount, isBalanceHidden)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
