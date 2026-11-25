# GRANA — PRD

> Documento de requisitos do produto. Fonte da verdade sobre **o que** o GRANA faz e **por quê**.
> Decisões técnicas e convenções de código ficam no [CLAUDE.md](CLAUDE.md).

## 1. Visão

GRANA tira a gestão financeira pessoal das planilhas e leva para um sistema de fácil acesso:

- **No computador:** visão completa, planejamento e gestão (cadastros, orçamentos, faturas).
- **No celular (PWA):** acompanhar como estão as contas e fazer **lançamentos rápidos**.

Começa para uso pessoal, mas é construído desde o primeiro dia como **multiusuário**. Inclui o módulo **MÔNEY**, para gastos em casal.

O uso começa do zero, sem importar histórico das planilhas.

## 2. Usuários

| Persona | Descrição |
|---|---|
| Dono | Usa o GRANA para toda a vida financeira pessoal. |
| Parceiro(a) | Tem login próprio. Entra no espaço MÔNEY por convite. Pode ou não usar o resto do GRANA. |
| Futuros usuários | Qualquer pessoa que crie conta. Dados sempre isolados por usuário. |

## 3. Glossário

| Termo | Significado |
|---|---|
| **Conta** | Onde o dinheiro está: conta corrente (Nubank, Itaú, C6, Caixa…), carteira (dinheiro físico) ou cartão de crédito. |
| **Lançamento** | Um movimento financeiro: **receita**, **despesa** ou **transferência**. |
| **Forma de pagamento** | Dinheiro, débito, crédito ou pix. |
| **Categoria** | Classificação do lançamento (Mercado, Lazer, Estudos, Salário…). Sem subcategorias. |
| **Fatura** | Agrupamento das compras de um cartão entre dois fechamentos, com uma data de vencimento. |
| **Mês financeiro** | Período usado em orçamentos e relatórios. Começa num dia configurável (ex.: dia 26) e leva o nome do mês em que termina. Ex.: 26/11 a 25/12 = **dezembro**. |
| **Gasto fixo** | Despesa recorrente de valor e dia fixos, gerada automaticamente todo mês. |
| **Orçamento** | Limite mensal de gasto por categoria, com saldo acumulado entre meses. |
| **Espaço MÔNEY** | Área compartilhada entre duas pessoas para dividir gastos. |

## 4. Requisitos funcionais

### 4.1 Lançamentos

- Campos de uma **despesa**: valor, data, descrição, categoria, conta e forma de pagamento.
  - A forma de pagamento é coerente com a conta: crédito → cartão; débito/pix → conta corrente; dinheiro → carteira.
- **Receita**: valor, data, descrição, categoria (de receita) e conta de destino.
- **Transferência** entre contas próprias (ex.: Nubank → Itaú, pagamento de fatura). Não conta como receita nem despesa.
- Editar e excluir lançamentos.
- Lista de lançamentos com filtros por mês financeiro, conta, categoria, tipo e texto.
- **Lançamento rápido no celular:** botão "+" sempre visível; formulário curto com valor em destaque e últimos valores usados (conta, forma de pagamento) pré-preenchidos.

### 4.2 Cartões de crédito e faturas

- Cada cartão tem **dia de fechamento**, **dia de vencimento** e a **conta padrão de pagamento**.
  - Exemplo (Nubank): fecha dia 18, vence dia 25.
- Toda compra no crédito é associada automaticamente à fatura correta pela data da compra:
  - compra até o dia do fechamento → fatura que fecha naquele mês;
  - compra depois do fechamento → fatura do mês seguinte.
  - O usuário pode mover manualmente uma compra para outra fatura.
- **Compras parceladas:** ao lançar uma compra em N vezes, o sistema gera N parcelas, uma em cada fatura consecutiva. As parcelas ficam ligadas à compra original (editar ou excluir a compra afeta todas).
- **Pagamento de fatura** = transferência da conta corrente para o cartão. **Nunca é despesa.**
  - A despesa já foi registrada na compra. Uma compra de R$ 10 conta como R$ 10 de gasto uma única vez, não importa quando a fatura é paga.
- Tela de **Faturas**: fatura aberta, fechada e paga, com total, vencimento e valor pago. Mostra o fluxo de caixa ("dia 25/12 saem R$ X da conta Nubank").
- **Limite do cartão (MVP):** cadastro do limite total; limite disponível = limite − compras ainda não pagas (incluindo parcelas futuras). Pagar a fatura libera o limite.

### 4.3 Gastos fixos

- Cadastro: descrição, valor, dia do mês, categoria, conta e forma de pagamento.
- O sistema gera o lançamento automaticamente no dia, todo mês, sem duplicar.
- Pode ser pausado ou encerrado sem afetar os lançamentos já gerados.
- Tela com a lista de gastos fixos e o **total fixo mensal**.
- Um gasto fixo pode ser marcado como **compartilhado no MÔNEY** (ex.: plano do iCloud).

### 4.4 Orçamentos

- Valor **mensal por categoria** de despesa.
- Calculado por **mês financeiro**, usando a **data da compra** (ver regra 6.2).
- **Saldo acumulativo:**
  - `saldo do mês = orçamento do mês + saldo do mês anterior − gasto do mês`
  - Se sobrar, o saldo positivo passa para o mês seguinte.
  - Se estourar, o saldo negativo reduz o mês seguinte.
- **Alterar o valor do orçamento vale do mês financeiro atual em diante.** Meses anteriores mantêm o valor que tinham (histórico de valores por categoria).
- Visualização: orçado × gasto × saldo por categoria, com barra de progresso e alerta ao passar de 80% e 100%.

### 4.5 Receitas e saldos

- Cada conta tem um **saldo inicial**, informado no cadastro.
- Saldo da conta = saldo inicial + receitas − despesas ± transferências.
- Cartão de crédito mostra o valor das faturas em aberto (e o limite disponível, se o limite for informado).

### 4.6 Home

- **Desktop:** um painel com um resumo de cada área, cada card levando à aba de detalhe:
  - saldo das contas;
  - receitas × despesas do mês financeiro;
  - orçamento por categoria;
  - próximas faturas;
  - gastos fixos do mês;
  - saldo do MÔNEY.
- **Celular:** versão compacta dos mesmos cards, com o botão "+" fixo.

### 4.7 Cadastros (painel de configuração)

- Gerenciar **contas**, **cartões**, **categorias** (de receita e de despesa) e o **dia de início do mês financeiro**.
- Itens já usados em lançamentos são **arquivados**, não excluídos, para preservar o histórico.
- Categorias com nome, cor e ícone.

### 4.8 Autenticação

- E-mail e senha (Supabase Auth), com recuperação de senha.
- Login com Google fica para depois (configuração simples, sem mudança no modelo de dados).

### 4.9 MÔNEY (gastos em casal)

Modelo inspirado na planilha atual de controle do casal:

- Um usuário cria um **espaço MÔNEY** e **convida** o outro por e-mail. O convidado precisa ter (ou criar) uma conta no GRANA e aceitar o convite.
- Os dois membros lançam gastos compartilhados: data, descrição, valor total e **quem pagou**.
- **Divisão padrão 50/50**, com opção de ajustar a parte de cada um quando necessário (na planilha atual há lançamentos com divisão diferente da metade).
- **Acerto (pagamento entre os dois):** um lançamento que conta 100% para o saldo, sem divisão (ex.: um pix de um para o outro).
- **Saldo corrido único:**
  - **verde** = o outro me deve;
  - **vermelho** = eu devo ao outro.
  - Não há obrigação de zerar. O saldo pode ficar positivo ou negativo pelo tempo que o casal quiser.
- Histórico em formato de tabela: data, descrição, valor total, minha parte e saldo acumulado.
- **Gastos fixos compartilhados** (ex.: iCloud) geram o lançamento no MÔNEY todo mês.
- **Integração com o financeiro pessoal:** quando eu pago R$ 100 de um gasto do casal com minha conta:
  - minha conta perde R$ 100;
  - no meu orçamento conta só **a minha parte (R$ 50)**;
  - a outra parte (R$ 50) vira saldo a receber no MÔNEY.
- **Quando o outro paga** R$ 100 do casal:
  - nenhuma conta minha é movimentada;
  - a minha parte (R$ 50) entra no meu orçamento, **na mesma categoria** escolhida por quem lançou;
  - como as categorias são de cada usuário, o sistema associa pelo nome; se eu não tiver uma categoria com esse nome, ela é criada para mim;
  - os R$ 50 viram saldo a pagar no MÔNEY.

## 5. Requisitos não funcionais

- **PWA instalável** no celular, rápida, com layout pensado primeiro para o lançamento rápido.
- **Multiusuário e seguro:** cada usuário só acessa os próprios dados; os dados do MÔNEY são visíveis só aos membros do espaço (Row Level Security no Postgres).
- **Custo zero no início:** caber no plano free do Supabase e numa hospedagem estática gratuita.
- **Precisão monetária:** valores sem erro de arredondamento (centavos inteiros).
- Interface em **português (pt-BR)**, moeda **BRL**, fuso **America/Sao_Paulo**.

## 6. Regras de negócio críticas

### 6.1 Sem dupla contagem no cartão
Despesa no cartão é registrada **uma vez**, na compra. O pagamento da fatura é transferência e nunca entra em relatórios de gasto nem em orçamento: o sistema entende que pagou o que já vinha sendo lançado.

Exemplo com o Nubank (fecha 18, vence 25) e mês financeiro começando no dia 26:

| Compra | Valor | Fatura | Conta no "total gasto" de |
|---|---|---|---|
| 20/11 | R$ 40 | dezembro (vence 25/12) | **novembro** (26/10–25/11) |
| 10/12 | R$ 60 | dezembro (vence 25/12) | **dezembro** (26/11–25/12) |
| 25/12 — pagamento da fatura | R$ 100 | — | **nada** (transferência Itaú/Nubank → cartão) |

Total gasto: R$ 40 em novembro + R$ 60 em dezembro = R$ 100, uma vez só. A fatura que atravessa dois meses tem cada compra contada no seu próprio mês.

### 6.2 Mês financeiro e competência (opção A)
- O mês financeiro começa no dia configurado pelo usuário (padrão do dono: dia 26) e leva o nome do mês em que termina.
- Orçamentos e relatórios de gasto usam a **data da compra**, para qualquer forma de pagamento.
- Parcelas: a parcela *k* conta no mês financeiro de `data da compra + (k−1) meses`.
- A visão de **caixa** (quando o dinheiro sai) fica na tela de Faturas.
- Se essa regra não funcionar no uso real, pode ser revista.

### 6.3 Cálculo da fatura
- Compra com dia ≤ dia de fechamento → fatura que fecha no mesmo mês; senão, a do mês seguinte.
- Vencimento: se o dia de vencimento for maior que o de fechamento, vence no mesmo mês do fechamento; senão, no mês seguinte.
- Dias inexistentes no mês (ex.: 31 em fevereiro) usam o último dia do mês.

### 6.4 Parcelamento
Valor de cada parcela = total ÷ N em centavos; a diferença do arredondamento vai na primeira parcela.

### 6.5 MÔNEY no orçamento pessoal
Só a minha parte de um gasto compartilhado entra no meu orçamento, na categoria escolhida por quem lançou, não importa quem pagou. A parte do outro é saldo a receber (ou a pagar) no MÔNEY.

### 6.6 Mudança de datas (mês financeiro e cartão)
Não é algo frequente, mas precisa ser possível. Em todos os casos, **a mudança vale só daqui para a frente**; nada do passado é recalculado.

- **Dia de início do mês financeiro:** vale a partir do próximo mês financeiro. O mês de transição fica mais curto ou mais longo para emendar os períodos (ex.: trocar de 26 para 1º → o mês corrente vai de 26 até o fim do mês do calendário).
- **Dia de fechamento ou vencimento do cartão:** vale a partir da próxima fatura. Faturas já fechadas e a fatura aberta mantêm as datas que tinham; a fatura de transição pode ficar com um ciclo mais curto ou mais longo. O usuário informa a partir de qual fatura a nova data vale.
- O GRANA não valida as regras do banco para troca de datas (cada banco tem as suas); só registra a mudança que o banco já aplicou.

## 7. Fora do escopo do MVP

- Importação de histórico, extratos ou faturas (CSV/OFX).
- Integração bancária automática (Open Finance).
- Tags livres além das categorias.
- Múltiplas moedas.
- Juros, rotativo e pagamento mínimo de fatura.
- Lançamento offline.
- Login com Google.

## 8. Roadmap

| Fase | Entrega |
|---|---|
| 0 | Setup: projeto Vite + React + TS, Supabase, autenticação, PWA, deploy. |
| 1 | Contas, categorias, lançamentos (receita, despesa, transferência), saldos. |
| 2 | Cartões, faturas, parcelamento e pagamento de fatura. |
| 3 | Gastos fixos, orçamentos com saldo acumulado e Home. |
| 4 | MÔNEY: espaço, convite, gastos compartilhados, acertos e saldo. |
| 5 | Extras: login com Google, relatórios e gráficos, importação, tags. |

## 9. Questões em aberto

Nenhuma no momento. Decisões já tomadas:

- MÔNEY quando o outro paga → minha parte entra no orçamento, na mesma categoria de quem lançou (§4.9).
- Mudança no valor do orçamento → vale do mês atual em diante (§4.4).
- Limite do cartão → entra no MVP (§4.2).
- Mudança do dia de início do mês financeiro ou das datas do cartão → vale só para os próximos meses/faturas (§6.6).
