import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Settings() {
  const { signOut, user } = useAuth()

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h1>
      </div>
      <Card className="border-border/50 bg-card/40">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Usuário Logado</span>
            <span className="text-base">{user?.email}</span>
          </div>
          <Button variant="destructive" onClick={() => signOut()}>
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
