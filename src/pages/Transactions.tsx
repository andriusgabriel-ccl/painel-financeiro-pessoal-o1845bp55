import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingDown, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Line, LineChart, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useFinance } from '@/contexts/FinanceContext'
import { formatCurrency } from '@/lib/format'
import { cn, generateChartData } from '@/lib/utils'

export default function Transactions() {
  const [searchParams] = useSearchParams()
  const entityId = searchParams.get('entity')
  const { isBalanceHidden, entities, transactions: allTransactions } = useFinance()

  const entity = entityId ? entities[entityId] : null
  const transactions = entityId ? allTransactions[entityId] || [] : []

  const chartData = useMemo(() => {
    return entity ? generateChartData(entity.balance) : []
  }, [entity])

  if (!entity) {
    return (
      <div className="animate-fade-in-up space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
        <Card className="border-border/50 bg-card/40 min-h-[400px] flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground">
            <p className="mb-4">
              Selecione uma entidade no painel para ver os detalhes e transações.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chartConfig = {
    balance: { label: 'Saldo', color: 'hsl(var(--primary))' },
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full shrink-0">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <entity.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none truncate">
              {entity.name}
            </h1>
            <span className="text-sm text-muted-foreground">{entity.type}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-border/50 bg-gradient-to-br from-card to-card/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {formatCurrency(entity.balance, isBalanceHidden)}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/50 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Evolução (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[120px] px-0 pb-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: any) => formatCurrency(value as number, isBalanceHidden)}
                        indicator="line"
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="var(--color-balance)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--color-balance)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/40">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium whitespace-nowrap">{tx.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{tx.description}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium',
                        tx.type === 'in' ? 'text-emerald-500' : 'text-rose-500',
                      )}
                    >
                      {tx.type === 'in' ? (
                        <>
                          <TrendingUp className="h-3.5 w-3.5" /> Entrada
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3.5 w-3.5" /> Saída
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal capitalize whitespace-nowrap">
                      {tx.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-normal capitalize text-xs whitespace-nowrap"
                    >
                      {tx.origin}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-semibold tabular-nums whitespace-nowrap',
                      tx.type === 'in' ? 'text-emerald-500' : 'text-rose-500',
                    )}
                  >
                    {tx.type === 'in' ? '+' : '-'} {formatCurrency(tx.amount, isBalanceHidden)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
