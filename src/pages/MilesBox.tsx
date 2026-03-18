import { useState } from 'react'
import { Ticket, Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MilesSummaryCard } from '@/components/miles/MilesSummaryCard'
import { MilesHistoryTable } from '@/components/miles/MilesHistoryTable'
import { NewMilesMovementModal } from '@/components/miles/NewMilesMovementModal'
import { MilesConfigModal } from '@/components/miles/MilesConfigModal'

const PROGRAMS = ['Smiles', 'Latam Pass', 'TudoAzul']

export default function MilesBox() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Caixa de Milhas</h1>
            <p className="text-sm text-muted-foreground">Gerencie seu estoque e lucratividade</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsConfigModalOpen(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preços Base</span>
          </Button>
          <Button onClick={() => setIsNewModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAMS.map((prog, index) => (
          <MilesSummaryCard key={prog} programa={prog} styleDelay={index * 100} />
        ))}
      </div>

      <MilesHistoryTable />

      <NewMilesMovementModal open={isNewModalOpen} onOpenChange={setIsNewModalOpen} />
      <MilesConfigModal open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen} />
    </div>
  )
}
