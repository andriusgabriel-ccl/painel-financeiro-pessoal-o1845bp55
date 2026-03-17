import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Transactions() {
  const [searchParams] = useSearchParams()
  const entityId = searchParams.get('entity')

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
      </div>
      <Card className="border-border/50 bg-card/40 min-h-[400px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <p className="mb-2">Lista de transações em desenvolvimento.</p>
          {entityId && (
            <p className="text-sm font-medium text-primary">
              Filtrado pela entidade: {entityId.toUpperCase()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
