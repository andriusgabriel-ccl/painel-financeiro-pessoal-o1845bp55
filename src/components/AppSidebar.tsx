import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowRightLeft, PieChart, Settings, Wallet, ListTodo } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navigation = [
  { name: 'Painel', href: '/', icon: LayoutDashboard },
  { name: 'Transações', href: '/transacoes', icon: ArrowRightLeft },
  { name: 'Obrigações', href: '/obrigacoes', icon: ListTodo },
  { name: 'Relatórios', href: '/relatorios', icon: PieChart },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Finanças Pro</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-6 px-4">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-subtle border border-border/50 transition-colors hover:bg-accent/50 cursor-pointer">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4"
              alt="User"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-foreground">João Diretor</span>
            <span className="truncate text-xs text-muted-foreground">Conta Premium</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
