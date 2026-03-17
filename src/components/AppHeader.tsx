import { Eye, EyeOff, Plus, Bell } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useFinance } from '@/contexts/FinanceContext'

export function AppHeader() {
  const { isBalanceHidden, toggleBalance } = useFinance()

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 glass-effect px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden md:flex flex-col">
          <h1 className="text-sm font-semibold tracking-tight">Painel Financeiro</h1>
          <p className="text-xs text-muted-foreground capitalize">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleBalance}
          className="text-muted-foreground hover:text-foreground"
          title={isBalanceHidden ? 'Mostrar valores' : 'Ocultar valores'}
        >
          {isBalanceHidden ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </Button>

        <Button className="ml-2 gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Transação</span>
        </Button>
      </div>
    </header>
  )
}
