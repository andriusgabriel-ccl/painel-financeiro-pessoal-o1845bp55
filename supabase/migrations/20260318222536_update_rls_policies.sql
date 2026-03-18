-- Enable RLS and establish strict policies for all tables allowing authenticated users to manage only their own data
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
            ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "Enable ALL for authenticated users based on user_id" ON public.%I;
            CREATE POLICY "Enable ALL for authenticated users based on user_id" ON public.%I
            AS PERMISSIVE FOR ALL TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        ', t_name, t_name, t_name);
    END LOOP;
END $$;
