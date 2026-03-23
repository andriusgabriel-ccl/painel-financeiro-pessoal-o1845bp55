import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { AppHeader } from '@/components/AppHeader'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useFinance } from '@/contexts/FinanceContext'
import { toast } from 'sonner'

export default function Layout() {
  const { user } = useAuth()
  const { refreshData } = useFinance()

  useEffect(() => {
    if (!user) return

    let isPolling = false

    const pollTelegram = async () => {
      if (isPolling) return
      isPolling = true
      try {
        const { data, error } = await supabase.functions.invoke('telegram-polling')
        if (data?.success && data?.processed > 0) {
          toast.success(`${data.processed} nova(s) transação(ões) via Telegram processada(s)!`)
          refreshData()
        }
      } catch (err) {
        console.error('Erro no polling do Telegram:', err)
      } finally {
        isPolling = false
      }
    }

    const interval = setInterval(pollTelegram, 10000)
    pollTelegram()

    return () => clearInterval(interval)
  }, [user, refreshData])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/30 scroll-smooth">
        <AppSidebar />
        <div className="flex w-full flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
