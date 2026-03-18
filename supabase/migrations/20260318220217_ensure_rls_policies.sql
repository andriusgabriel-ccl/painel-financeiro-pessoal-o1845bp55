-- Enable RLS for all tables
ALTER TABLE public.entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obrigacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos_cartao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posicoes_investimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_investimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_milhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_milhas ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables allowing authenticated users to CRUD their own data
DO $$ 
DECLARE
    t_name text;
BEGIN
    FOR t_name IN 
        SELECT unnest(ARRAY[
            'entidades', 'categorias', 'lancamentos', 'obrigacoes', 
            'cartoes', 'lancamentos_cartao', 'posicoes_investimento', 
            'movimentacoes_investimento', 'configuracoes_milhas', 'movimentacoes_milhas'
        ])
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "Enable ALL for authenticated users based on user_id" ON public.%I;
            CREATE POLICY "Enable ALL for authenticated users based on user_id" ON public.%I
            AS PERMISSIVE FOR ALL TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        ', t_name, t_name);
    END LOOP;
END $$;
