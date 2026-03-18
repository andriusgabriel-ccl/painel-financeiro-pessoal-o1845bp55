CREATE TABLE public.entidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('PF', 'PJ')),
    icon_name TEXT NOT NULL DEFAULT 'Building',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    entidade_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    entidade_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE NOT NULL,
    data DATE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('in', 'out', 'transfer')),
    valor NUMERIC(15, 2) NOT NULL,
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    descricao TEXT NOT NULL,
    observacoes TEXT,
    entidade_destino_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE,
    origem TEXT NOT NULL CHECK (origem IN ('interna', 'externa')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.obrigacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    entidade_id UUID REFERENCES public.entidades(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT NOT NULL,
    valor NUMERIC(15, 2) NOT NULL,
    vencimento DATE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('payable', 'receivable')),
    status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'atrasado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.entidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obrigacoes ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can manage their own entidades" ON public.entidades
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own categorias" ON public.categorias
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own lancamentos" ON public.lancamentos
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own obrigacoes" ON public.obrigacoes
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed Function
CREATE OR REPLACE FUNCTION public.handle_new_user_seed()
RETURNS trigger AS $$
DECLARE
    sp_id UUID;
    mp_id UUID;
    av_id UUID;
    mf_id UUID;
    
    sp_cat_salario UUID;
    sp_cat_irpf UUID;
    sp_cat_beneficios UUID;
    sp_cat_transf UUID;

    mp_cat_compra UUID;
    mp_cat_venda_ag UUID;
    mp_cat_fatura UUID;
    mp_cat_transf UUID;

    av_cat_receita UUID;
    av_cat_compra UUID;
    av_cat_custos UUID;
    av_cat_repasse UUID;

    mf_cat_aporte UUID;
    mf_cat_rendimento UUID;
    mf_cat_dividendos UUID;
    mf_cat_bitcoin UUID;
BEGIN
    -- Entidades
    INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
    (gen_random_uuid(), NEW.id, 'Servidor Público', 'PF', 'Building') RETURNING id INTO sp_id;
    
    INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
    (gen_random_uuid(), NEW.id, 'Milheiro Profissional', 'PF', 'CreditCard') RETURNING id INTO mp_id;
    
    INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
    (gen_random_uuid(), NEW.id, 'Agência de Viagens', 'PJ', 'Plane') RETURNING id INTO av_id;
    
    INSERT INTO public.entidades (id, user_id, nome, tipo, icon_name) VALUES
    (gen_random_uuid(), NEW.id, 'Mercado Financeiro', 'PF', 'LineChart') RETURNING id INTO mf_id;

    -- Categorias
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'Salário STN') RETURNING id INTO sp_cat_salario;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'IRPF') RETURNING id INTO sp_cat_irpf;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'Benefícios') RETURNING id INTO sp_cat_beneficios;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, sp_id, 'Transferência para Milheiro') RETURNING id INTO sp_cat_transf;

    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Compra de Milhas') RETURNING id INTO mp_cat_compra;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Venda para Agência') RETURNING id INTO mp_cat_venda_ag;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Fatura Cartão') RETURNING id INTO mp_cat_fatura;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mp_id, 'Transferência Recebida') RETURNING id INTO mp_cat_transf;

    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Receita de Emissões') RETURNING id INTO av_cat_receita;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Compra de Milhas do Milheiro') RETURNING id INTO av_cat_compra;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Custos Operacionais') RETURNING id INTO av_cat_custos;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, av_id, 'Repasse PJ para PF') RETURNING id INTO av_cat_repasse;

    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Aporte') RETURNING id INTO mf_cat_aporte;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Rendimento Renda Fixa') RETURNING id INTO mf_cat_rendimento;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Dividendos ETF') RETURNING id INTO mf_cat_dividendos;
    INSERT INTO public.categorias (user_id, entidade_id, nome) VALUES (NEW.id, mf_id, 'Bitcoin') RETURNING id INTO mf_cat_bitcoin;

    -- Lançamentos SP
    INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
    (NEW.id, sp_id, CURRENT_DATE, 'in', 15000, sp_cat_salario, 'Salário STN', 'externa'),
    (NEW.id, sp_id, CURRENT_DATE - INTERVAL '1 day', 'out', 5000, sp_cat_transf, 'Transferência para Milheiro', 'interna'),
    (NEW.id, sp_id, CURRENT_DATE - INTERVAL '3 days', 'out', 3500, sp_cat_irpf, 'IRPF Retido', 'externa'),
    (NEW.id, sp_id, CURRENT_DATE - INTERVAL '8 days', 'in', 1200, sp_cat_beneficios, 'Auxílio Alimentação', 'externa');

    -- Lançamentos MP
    INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
    (NEW.id, mp_id, CURRENT_DATE, 'in', 5000, mp_cat_transf, 'Transferência Recebida', 'interna'),
    (NEW.id, mp_id, CURRENT_DATE - INTERVAL '1 day', 'out', 3500, mp_cat_compra, 'Compra TudoAzul', 'externa'),
    (NEW.id, mp_id, CURRENT_DATE - INTERVAL '4 days', 'in', 2800, mp_cat_venda_ag, 'Venda Balcão', 'interna'),
    (NEW.id, mp_id, CURRENT_DATE - INTERVAL '6 days', 'out', 4200, mp_cat_fatura, 'Pagamento Fatura Black', 'externa');

    -- Lançamentos AV
    INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
    (NEW.id, av_id, CURRENT_DATE, 'in', 12500, av_cat_receita, 'Emissão Pacote Miami', 'externa'),
    (NEW.id, av_id, CURRENT_DATE - INTERVAL '1 day', 'out', 2800, av_cat_compra, 'Compra Milhas MP', 'interna'),
    (NEW.id, av_id, CURRENT_DATE - INTERVAL '3 days', 'out', 2500, av_cat_custos, 'Aluguel Sala', 'externa'),
    (NEW.id, av_id, CURRENT_DATE - INTERVAL '8 days', 'out', 8000, av_cat_repasse, 'Distribuição Lucros', 'interna');

    -- Lançamentos MF
    INSERT INTO public.lancamentos (user_id, entidade_id, data, tipo, valor, categoria_id, descricao, origem) VALUES
    (NEW.id, mf_id, CURRENT_DATE, 'in', 450, mf_cat_rendimento, 'Rendimento Tesouro', 'externa'),
    (NEW.id, mf_id, CURRENT_DATE - INTERVAL '1 day', 'in', 2000, mf_cat_aporte, 'Aporte Mensal', 'interna'),
    (NEW.id, mf_id, CURRENT_DATE - INTERVAL '2 days', 'in', 125, mf_cat_dividendos, 'Dividendos IVVB11', 'externa'),
    (NEW.id, mf_id, CURRENT_DATE - INTERVAL '4 days', 'out', 1000, mf_cat_bitcoin, 'Compra BTC', 'externa');

    -- Obrigacoes SP
    INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
    (NEW.id, sp_id, 'IRPF Anual', 3500, CURRENT_DATE + INTERVAL '5 days', 'payable', 'pendente'),
    (NEW.id, sp_id, 'Conta de Água e Luz', 280, CURRENT_DATE + INTERVAL '2 days', 'payable', 'pendente'),
    (NEW.id, sp_id, 'Restituição IRPF', 1500, CURRENT_DATE + INTERVAL '15 days', 'receivable', 'pendente'),
    (NEW.id, sp_id, 'Mensalidade Clube', 350, CURRENT_DATE - INTERVAL '5 days', 'payable', 'pago');

    -- Obrigacoes MP
    INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
    (NEW.id, mp_id, 'Fatura Cartão Azul', 8500, CURRENT_DATE - INTERVAL '1 day', 'payable', 'atrasado'),
    (NEW.id, mp_id, 'Compra de Milhas Parcelada', 4200, CURRENT_DATE + INTERVAL '10 days', 'payable', 'pendente'),
    (NEW.id, mp_id, 'Venda Balcão (Agência)', 2800, CURRENT_DATE + INTERVAL '3 days', 'receivable', 'pendente');

    -- Obrigacoes AV
    INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
    (NEW.id, av_id, 'Fornecedor Hotelaria', 15000, CURRENT_DATE + INTERVAL '6 days', 'payable', 'pendente'),
    (NEW.id, av_id, 'Custos Operacionais', 4500, CURRENT_DATE + INTERVAL '20 days', 'payable', 'pendente'),
    (NEW.id, av_id, 'Faturamento Clientes', 22000, CURRENT_DATE + INTERVAL '2 days', 'receivable', 'pendente');

    -- Obrigacoes MF
    INSERT INTO public.obrigacoes (user_id, entidade_id, descricao, valor, vencimento, tipo, status) VALUES
    (NEW.id, mf_id, 'Aporte Programado Renda Fixa', 5000, CURRENT_DATE + INTERVAL '4 days', 'payable', 'pendente'),
    (NEW.id, mf_id, 'Vencimento Tesouro Direto', 12500, CURRENT_DATE + INTERVAL '25 days', 'receivable', 'pendente');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_seed
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_seed();

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'demo@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Demo User"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '',
    NULL, '', '', ''
  );
END $$;
