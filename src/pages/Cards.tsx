import { useState } from 'react'
import { Plus, CreditCard as CreditCardIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CardList } from '@/components/cards/CardList'
import { CardInvoice } from '@/components/cards/CardInvoice'
import { NewCardModal } from '@/components/cards/NewCardModal'
import { NewCardTransactionModal } from '@/components/cards/NewCardTransactionModal'
import { useCards } from '@/contexts/CardsContext'

export default function Cards() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [isNewCardOpen, setIsNewCardOpen] = useState(false)
  const [isNewTxOpen, setIsNewTxOpen] = useState(false)
  const { isLoading } = useCards()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <Skeleton className="h-12 w-48 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCardIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cartões de Crédito</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus limites e faturas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsNewCardOpen(true)}>
            Novo Cartão
          </Button>
          <Button onClick={() => setIsNewTxOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Compra
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight px-1">Meus Cartões</h2>
          <CardList selectedId={selectedCardId} onSelect={setSelectedCardId} />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight px-1 lg:hidden">
            Detalhes da Fatura
          </h2>
          <CardInvoice cardId={selectedCardId} />
        </div>
      </div>

      <NewCardModal open={isNewCardOpen} onOpenChange={setIsNewCardOpen} />
      <NewCardTransactionModal
        open={isNewTxOpen}
        onOpenChange={setIsNewTxOpen}
        defaultCardId={selectedCardId}
      />
    </div>
  )
}
