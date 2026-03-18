CREATE TABLE IF NOT EXISTS public.movimentacoes_milhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    programa TEXT NOT NULL CHECK (programa IN ('Smiles', 'Latam Pass', 'TudoAzul')),
    tipo TEXT NOT NULL CHECK (tipo IN ('compra', 'venda_agencia', 'venda_terceiro', 'transferencia', 'expiracao')),
    quantidade NUMERIC NOT NULL,
    valor_unitario NUMERIC NOT NULL,
    valor_total NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.configuracoes_milhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    programa TEXT NOT NULL CHECK (programa IN ('Smiles', 'Latam Pass', 'TudoAzul')),
    preco_venda_mercado NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, programa)
);

ALTER TABLE public.movimentacoes_milhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_milhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select_movimentacoes_milhas" ON public.movimentacoes_milhas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "authenticated_insert_movimentacoes_milhas" ON public.movimentacoes_milhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated_update_movimentacoes_milhas" ON public.movimentacoes_milhas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated_delete_movimentacoes_milhas" ON public.movimentacoes_milhas FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "authenticated_select_configuracoes_milhas" ON public.configuracoes_milhas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "authenticated_insert_configuracoes_milhas" ON public.configuracoes_milhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated_update_configuracoes_milhas" ON public.configuracoes_milhas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "authenticated_delete_configuracoes_milhas" ON public.configuracoes_milhas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed mock data for existing users to avoid empty states
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN SELECT id FROM auth.users LOOP
        -- Insert initial config
        INSERT INTO public.configuracoes_milhas (user_id, programa, preco_venda_mercado)
        VALUES 
            (u.id, 'Smiles', 15.50), 
            (u.id, 'Latam Pass', 22.00), 
            (u.id, 'TudoAzul', 18.00)
        ON CONFLICT (user_id, programa) DO NOTHING;

        -- Insert initial movements if empty
        IF NOT EXISTS (SELECT 1 FROM public.movimentacoes_milhas WHERE user_id = u.id) THEN
            INSERT INTO public.movimentacoes_milhas (user_id, data, programa, tipo, quantidade, valor_unitario, valor_total)
            VALUES
                (u.id, CURRENT_DATE - INTERVAL '15 days', 'Smiles', 'compra', 100000, 14.00, 1400.00),
                (u.id, CURRENT_DATE - INTERVAL '10 days', 'Latam Pass', 'compra', 50000, 20.00, 1000.00),
                (u.id, CURRENT_DATE - INTERVAL '5 days', 'TudoAzul', 'compra', 80000, 16.00, 1280.00),
                (u.id, CURRENT_DATE - INTERVAL '2 days', 'Smiles', 'venda_agencia', 40000, 15.50, 620.00),
                (u.id, CURRENT_DATE - INTERVAL '1 day', 'Latam Pass', 'venda_terceiro', 20000, 23.00, 460.00);
        END IF;
    END LOOP;
END $$;
