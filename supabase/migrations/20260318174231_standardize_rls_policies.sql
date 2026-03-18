-- Standardize RLS policies and ensure proper GRANTs

-- Grant usage on schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions for tables to authenticated and anon roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entidades TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categorias TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obrigacoes TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.movimentacoes_milhas TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.configuracoes_milhas TO authenticated, anon;

-- Ensure RLS is enabled for all tables
ALTER TABLE public.entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obrigacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_milhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_milhas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent duplicates/conflicts
DROP POLICY IF EXISTS "Users can manage their own entidades" ON public.entidades;
DROP POLICY IF EXISTS "authenticated_select_entidades" ON public.entidades;
DROP POLICY IF EXISTS "authenticated_insert_entidades" ON public.entidades;
DROP POLICY IF EXISTS "authenticated_update_entidades" ON public.entidades;
DROP POLICY IF EXISTS "authenticated_delete_entidades" ON public.entidades;

DROP POLICY IF EXISTS "Users can manage their own categorias" ON public.categorias;
DROP POLICY IF EXISTS "authenticated_select_categorias" ON public.categorias;
DROP POLICY IF EXISTS "authenticated_insert_categorias" ON public.categorias;
DROP POLICY IF EXISTS "authenticated_update_categorias" ON public.categorias;
DROP POLICY IF EXISTS "authenticated_delete_categorias" ON public.categorias;

DROP POLICY IF EXISTS "Users can manage their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "authenticated_select_lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "authenticated_insert_lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "authenticated_update_lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "authenticated_delete_lancamentos" ON public.lancamentos;

DROP POLICY IF EXISTS "Users can manage their own obrigacoes" ON public.obrigacoes;
DROP POLICY IF EXISTS "authenticated_select_obrigacoes" ON public.obrigacoes;
DROP POLICY IF EXISTS "authenticated_insert_obrigacoes" ON public.obrigacoes;
DROP POLICY IF EXISTS "authenticated_update_obrigacoes" ON public.obrigacoes;
DROP POLICY IF EXISTS "authenticated_delete_obrigacoes" ON public.obrigacoes;

DROP POLICY IF EXISTS "authenticated_select_movimentacoes_milhas" ON public.movimentacoes_milhas;
DROP POLICY IF EXISTS "authenticated_insert_movimentacoes_milhas" ON public.movimentacoes_milhas;
DROP POLICY IF EXISTS "authenticated_update_movimentacoes_milhas" ON public.movimentacoes_milhas;
DROP POLICY IF EXISTS "authenticated_delete_movimentacoes_milhas" ON public.movimentacoes_milhas;

DROP POLICY IF EXISTS "authenticated_select_configuracoes_milhas" ON public.configuracoes_milhas;
DROP POLICY IF EXISTS "authenticated_insert_configuracoes_milhas" ON public.configuracoes_milhas;
DROP POLICY IF EXISTS "authenticated_update_configuracoes_milhas" ON public.configuracoes_milhas;
DROP POLICY IF EXISTS "authenticated_delete_configuracoes_milhas" ON public.configuracoes_milhas;

-- Entidades policies
CREATE POLICY "entidades_select_policy" ON public.entidades FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "entidades_insert_policy" ON public.entidades FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "entidades_update_policy" ON public.entidades FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "entidades_delete_policy" ON public.entidades FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Categorias policies
CREATE POLICY "categorias_select_policy" ON public.categorias FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "categorias_insert_policy" ON public.categorias FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "categorias_update_policy" ON public.categorias FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "categorias_delete_policy" ON public.categorias FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Lancamentos policies
CREATE POLICY "lancamentos_select_policy" ON public.lancamentos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lancamentos_insert_policy" ON public.lancamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lancamentos_update_policy" ON public.lancamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lancamentos_delete_policy" ON public.lancamentos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Obrigacoes policies
CREATE POLICY "obrigacoes_select_policy" ON public.obrigacoes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "obrigacoes_insert_policy" ON public.obrigacoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "obrigacoes_update_policy" ON public.obrigacoes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "obrigacoes_delete_policy" ON public.obrigacoes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Movimentacoes milhas policies
CREATE POLICY "movimentacoes_milhas_select_policy" ON public.movimentacoes_milhas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "movimentacoes_milhas_insert_policy" ON public.movimentacoes_milhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "movimentacoes_milhas_update_policy" ON public.movimentacoes_milhas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "movimentacoes_milhas_delete_policy" ON public.movimentacoes_milhas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Configuracoes milhas policies
CREATE POLICY "configuracoes_milhas_select_policy" ON public.configuracoes_milhas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "configuracoes_milhas_insert_policy" ON public.configuracoes_milhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "configuracoes_milhas_update_policy" ON public.configuracoes_milhas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "configuracoes_milhas_delete_policy" ON public.configuracoes_milhas FOR DELETE TO authenticated USING (auth.uid() = user_id);
