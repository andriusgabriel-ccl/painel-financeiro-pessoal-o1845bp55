import { Card, CardContent } from '@/components/ui/card'

export default function Settings() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h1>
      </div>
      <Card className="border-border/50 bg-card/40 min-h-[400px] flex items-center justify-center">
        <CardContent className="text-muted-foreground">
          Módulo de configurações em desenvolvimento.
        </CardContent>
      </Card>
    </div>
  )
}
