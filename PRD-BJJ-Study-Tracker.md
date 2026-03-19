# PRD — BJJ GI Study Tracker (Faixa Azul vs Pesados)

## Prompt para Claude Code

Crie uma single-page application em HTML/CSS/JS vanilla (um único arquivo `index.html`) que funcione como um **guia de estudo interativo de Jiu-Jitsu GI** com persistência via `localStorage`. O app é para um faixa azul de 85kg que treina só GI contra oponentes pesados (100kg+). O design deve ser **clean, moderno e escuro** (dark theme) com estética marcial/tatame — sem parecer genérico de AI.

---

## 1. Estrutura de Conteúdo (dados hardcoded no JS)

O app organiza o estudo em **6 módulos**, cada um com vídeos/recursos e conceitos-chave. O usuário marca o que já viu/estudou e o app salva tudo em localStorage.

### Módulo 1 — Corrigir o Bow and Arrow (Arco e Flecha)
**Prioridade: URGENTE — correção rápida com maior retorno**

Conceitos-chave (checkboxes de estudo):
- [ ] Mão DIREITA na gola → cair pro lado DIREITO (mesmo lado da mão que estrangula)
- [ ] Seatbelt grip firme + hooks travados antes de iniciar
- [ ] Pegada funda na gola — polegar por dentro tocando a clavícula
- [ ] Girar 90 graus (ficar perpendicular ao oponente) antes de finalizar
- [ ] Mão livre agarra calça no joelho da perna distante (impede barrel roll)
- [ ] Estender o corpo puxando gola + joelho como arco e flecha
- [ ] Perna perto da cabeça pode passar panturrilha no bíceps dele
- [ ] Alternativa: Zipper Choke (Roger Gracie) — pegada dupla na gola sem mudar ângulo

Recursos (cada um com checkbox de "assistido/lido"):
- 🎥 Buchecha — Bow and Arrow passo a passo (GI) → https://www.youtube.com/watch?v=TfDt15dbgLk
- 🎥 Professor Leandro — Finalizações das costas GI (PT) → https://www.youtube.com/watch?v=HWValclCydg
- 📝 BJJ Fanatics — "Master The Bow & Arrow Step-By-Step" com Lachlan Giles (EN)
- 📝 Grapplearts — "How To Do the Bow and Arrow Choke" com Emily Kwok (EN)
- 📝 Graciemag — "Aprenda a finalizar no arco e flecha com Ricardo Franjinha" (PT)
- 📝 Evolve Daily — "How To Complete The Bow And Arrow Choke" com Teco Shinzato (EN)

5 erros mais comuns (lista visual fixa, não checkbox):
1. Cair pro lado errado (cria espaço pro escape)
2. Pegada rasa na gola (precisa ser profunda)
3. Não segurar calça/perna (permite barrel roll)
4. Não girar 90 graus antes de finalizar
5. Lapela passando sobre o queixo (vira dor, não choke real)

---

### Módulo 2 — Retenção de Montada (Mount Retention)
**Prioridade: ALTA — maior problema atual**

Conceitos-chave:
- [ ] Peso TODO no quadril dele, NÃO nos joelhos
- [ ] Sistema progressivo: Low Mount → High Mount → Technical Mount
- [ ] Low mount: joelhos apertados nas costelas, quadril pesado no abdômen
- [ ] Se ele tenta elbow-knee escape → subir pra high mount
- [ ] Se ele coloca um cotovelo → transitar pra technical mount (cadeirinha)
- [ ] Controlar ombros no tatame (escapes começam com ombro)
- [ ] Ataques duplos: gola + braço (dilema: defende pescoço = abre armlock)
- [ ] Reagir ANTES que o oponente complete o setup da fuga
- [ ] Neutralizar as 2 fugas: upa (bridge and roll) e recomposição de guarda (elbow-knee)
- [ ] No GI: pegada de gola = arma principal na montada

Recursos:
- 🎥 Rayron Gracie — Retenção de montada GI → https://www.youtube.com/watch?v=vXnXBOVppu8
- 📝 Graciemag — "10 Dicas para Melhorar Sua Montada" (PT) → https://www.graciemag.com/onde-voce-tem-errado-ao-montar-10-dicas-de-jiu-jitsu-para-melhorar-sua-montada/
- 🎥 Emily Kwok & Stephan Kesting — "How to Stabilise Mount Against Bigger Opponent" (EN, Grapplearts)
- 📝 Roger Gracie Key Concepts for Mount (bjjee.com, EN)
- 📝 Venum Blog — "Dicas para Melhorar Sua Montada" (PT)

---

### Módulo 3 — Controle de Costas no GI (Back Control)
**Prioridade: ALTA — posição #1 contra pesados**

Conceitos-chave:
- [ ] Costas = posição dominante mais segura contra pesados (peso deles é irrelevante)
- [ ] Seatbelt grip: braço por cima do ombro + braço por baixo da axila
- [ ] Mão de baixo cobre a mão de cima (dificulta grip fighting dele)
- [ ] Pegadas de GI: gola (ameaça choke), faixa/cintura (controla quadril), calça no joelho
- [ ] Vencer o grip fighting: descolar braço de cima dele → controlar pulso → puxar braço atrás das costas → entrar com choke
- [ ] Se defender a pegada de gola → trocar de lado (underhook vira mão de choke)
- [ ] Finalizações por prioridade: Bow and Arrow > Zipper Choke > Sliding Collar > Mata Leão > Ezekiel pela manga

Recursos:
- 📝 Jiu Jitsu Legacy — "Never Lose BJJ Back Control: Human Backpack" (EN, gratuito)
- 📝 Gracie Barra — "A Posição Suprema - Ataques das Costas" (PT)
- 📝 BJJ Notícias — "Pegada pelas Costas no Jiu-Jitsu" (PT)

---

### Módulo 4 — Contra Oponentes Pesados (85kg vs 100kg+)
**Prioridade: MÉDIA — estratégia geral**

Conceitos-chave:
- [ ] Costas > Montada contra pesados (na montada ele te joga, nas costas o peso é irrelevante)
- [ ] Chokes > Joint locks (não existe cara durão pra estrangulamento)
- [ ] Evitar: armbar, triângulo (difícil fechar), arm triangle, kimura (disputa de força)
- [ ] Guardas de distância: Spider, Lasso, Butterfly (força das pernas > braços)
- [ ] Evitar closed guard (ele empilha peso)
- [ ] Passagem: speed passes (toreando, leg drag) — NÃO pressure passes
- [ ] Controle distância com grips no quadril + pé no bíceps
- [ ] Buscar ângulos laterais (nunca ficar de frente)
- [ ] Half guard com underhook + arm drag → back take
- [ ] 90% paciência, 10% explosão — pesado gasta mais energia por minuto

Recursos:
- 🎥 Vídeo em PT — Dicas contra pesados → https://www.youtube.com/watch?v=iuDuTL84Hcw
- 📝 Loja do Kimono — "21 Estratégias para Vencer Adversários Maiores" (PT)
- 📝 In The Guard — "18 Dicas Contra Lutadores Maiores" (PT)
- 📝 BJJ World — "7 Strategies to Defeat Bigger Opponents" (EN)
- 💰 Bruno Malfacine — "Como Lutar Contra o Adversário Maior" (BJJ Fanatics BR, pago)

---

### Módulo 5 — Grip Fighting no GI
**Prioridade: MÉDIA — para de deixar pegarem tua mão**

Conceitos-chave:
- [ ] Quebrar grips do oponente PRIMEIRO antes de impor os seus
- [ ] "Decoy grips" — pegadas falsas pra abrir a real
- [ ] Não fazer death-grip (queima antebraço) — usar pegadas inteligentes
- [ ] Tirar pegadas desnecessárias do oponente imediatamente
- [ ] Usar frames ósseos (esqueleto) em vez de força muscular
- [ ] No GI: gola = controle grátis, aproveitar isso

Recursos:
- 🎥 Jordan Teaches Jiu-Jitsu — Grip Fighting Guide (EN, fácil) → https://www.youtube.com/watch?v=n6EUwvCkWJ8
- 🎥 Chewjitsu — 4 Princípios de Grip Fighting (EN, prático) → https://www.youtube.com/watch?v=7kamw42pMIc

---

### Módulo 6 — Gestão de Energia e Respiração
**Prioridade: MÉDIA — parar de gasar**

Conceitos-chave:
- [ ] Problema NÃO é falta de cardio — é excesso de tensão muscular
- [ ] Respiração diafragmática (barriga, não peito)
- [ ] Exalar ativamente durante movimentos (sons: "chá", "shu")
- [ ] Se respira pelo nariz = ritmo sustentável; pela boca = tá no vermelho
- [ ] Preso embaixo de pesado → virar de lado (respirar é 10x mais fácil de lado)
- [ ] Power hips: um pé plantado, outra perna estendida → cria espaço pra respirar
- [ ] Evitar a todo custo ficar preso no side control por baixo (mais drena energia)
- [ ] Drills devagar no começo do treino (montada + costas) = endurance técnica

Recursos:
- 📝 Rílion Gracie Trindade — "Gás no Jiu Jitsu: 5 Dicas para Cansar Menos" (PT)
- 📝 BJJ Fanatics BR — "Pare De Fazer Força Desnecessária" (PT)
- 🎥 Stephan Kesting — Breathing under pressure (EN, Grapplearts)

---

## 2. Funcionalidades do App

### 2.1 Dashboard Principal
- Header com título "BJJ GI Study Tracker" e subtítulo "Faixa Azul • 85kg • Foco em GI"
- **Barra de progresso geral** (% de todos os checkboxes marcados)
- **Cards dos 6 módulos** em grid responsivo (2 colunas desktop, 1 mobile)
  - Cada card mostra: nome do módulo, tag de prioridade (URGENTE/ALTA/MÉDIA), barra de progresso do módulo, contagem (ex: "5/8 conceitos • 2/6 vídeos")
  - Ao clicar no card, expande ou navega pra seção detalhada do módulo

### 2.2 Dentro de Cada Módulo
- **Seção "Conceitos-Chave"**: lista de checkboxes. Ao marcar, salva em localStorage com timestamp (data que marcou)
- **Seção "Recursos"**: cada recurso tem:
  - Checkbox de "Assistido/Lido"
  - Ícone (🎥 vídeo, 📝 artigo, 💰 pago)
  - Nome clicável (abre link em nova aba)
  - Tag de idioma: `PT` ou `EN`
  - Quando marcado como assistido, mostra a data em que foi marcado (cinza, pequeno)
- **Seção "Erros Comuns"** (se houver, como no Módulo 1): lista visual estática (não checkbox), estilizada tipo "danger/warning cards"

### 2.3 Seção "Finalizações em Foco"
Uma seção especial separada dos módulos onde o usuário pode:
- Selecionar quais finalizações está focando no momento (de uma lista pré-definida):
  - Bow and Arrow, Zipper Choke, Sliding Collar, Cross Choke, Mata Leão, Ezekiel pela manga, Guilhotina, Omoplata, Loop Choke, Clock Choke
- Pra cada finalização selecionada como "em foco":
  - Campo de texto livre pra anotar observações pessoais (ex: "funcionou no treino de terça contra o fulano de 95kg")
  - Contador de "tentei no treino" e "finalizei no treino" (botões de + e -)
  - Taxa de sucesso calculada automaticamente (tentativas vs finalizações)
- Tudo salvo em localStorage

### 2.4 Seção "Log de Treinos" (simples)
- Botão "Registrar Treino"
- Ao clicar, abre um mini-form:
  - Data (default: hoje)
  - Duração (30min, 1h, 1h30, 2h — select)
  - O que treinei (campo de texto livre, 2-3 linhas)
  - Posições que peguei (multi-select chips: Montada, Costas, Side Control, Meia-guarda, Guarda, Passagem)
  - Finalizações que tentei (multi-select chips da lista de finalizações)
  - Finalizações que peguei (multi-select chips)
  - Humor/Energia pós-treino (emoji scale: 😤 😐 😊 🔥)
- Lista cronológica dos treinos registrados (mais recente primeiro)
- Tudo em localStorage

### 2.5 Canais Recomendados (sidebar ou seção)
Lista fixa estilizada dos canais pra seguir, com:
- Nome, link, tag PT/EN, descrição de 1 linha
- Canais:
  - **Feu BJJ** (PT) — Maior canal BR de BJJ, GI, fundamentais
  - **Art of Jiu-Jitsu / AOJ** (EN) — Irmãos Mendes, GI 100%, sistemático
  - **Chewjitsu** (EN) — Blue belt tips, retenção, mentalidade
  - **Lachlan Giles / Submeta** (EN) — Giant killer, metódico, GI e NoGI
  - **Bernardo Faria** (EN) — 5x mundial, sotaque BR fácil de entender
  - **BJJ Scout** (EN) — Análise visual pura, sem barreira de idioma
  - **Jordan Teaches Jiujitsu** (EN) — Conceitual, pronúncia clara
  - **Stephan Kesting** (EN) — Educacional, breathing, fundamentos
  - **Keenan Cornelius** (EN) — Jogo de lapela, worm guard, GI focado
  - **IBJJF Oficial** (sem idioma) — Lutas completas de mundiais

### 2.6 Funcionalidades de localStorage
- Salvar/carregar automaticamente TODO estado: checkboxes, notas, logs de treino, finalizações em foco, contadores
- Botão "Exportar Dados" (gera JSON do localStorage pra backup)
- Botão "Importar Dados" (upload de JSON pra restaurar)
- Botão "Resetar Tudo" (com confirmação dupla: "Tem certeza? Isso apaga todo seu progresso.")
- Ao marcar qualquer checkbox, salvar com timestamp ISO (pra mostrar "marcado em 18/03/2026")

---

## 3. Design e Estética

### Tema
- **Dark mode** obrigatório — fundo escuro (#0a0a0f ou similar), texto claro
- Acento principal: tom de azul profundo (remetendo à faixa azul) — algo como #2563eb ou #3b82f6
- Acento secundário: tom de vermelho/coral sutil pra tags de prioridade urgente
- Estética: **clean, editorial, com personalidade** — tipo um app de estudo premium, não um template Bootstrap

### Tipografia
- Usar Google Fonts. Sugestão: **"DM Sans"** ou **"Satoshi"** pro corpo, **"Clash Display"** ou **"Cabinet Grotesk"** pros títulos — MAS sinta-se livre pra escolher algo que fique marcante
- Hierarquia clara: título grande, subtítulos médios, corpo legível

### Layout
- Responsivo (mobile-first, funcionar bem no celular pq o cara vai usar no treino)
- Navegação por tabs ou scroll com sidebar fixa de navegação
- Cards com bordas sutis, sombras suaves, cantos arredondados
- Animações suaves nos checkboxes (ao marcar, um micro-feedback visual)
- Barras de progresso animadas

### Detalhes
- Tags de prioridade coloridas (URGENTE = vermelho, ALTA = laranja/amber, MÉDIA = azul)
- Tags de idioma (PT = verde, EN = azul claro)
- Ícones emoji pra tipo de recurso (🎥 📝 💰)
- Estado vazio bonito (quando não tem treinos logados, mostrar mensagem motivacional)
- Ao completar 100% de um módulo, mostrar feedback visual especial (confetti sutil ou badge)

---

## 4. Restrições Técnicas

- **Um único arquivo `index.html`** com CSS e JS inline/embedded
- **Vanilla JS puro** — sem frameworks, sem build step
- **localStorage** para toda persistência (nenhum backend)
- Google Fonts via CDN
- Sem dependências externas além de Google Fonts
- Funcionar offline após primeiro carregamento
- Performance: tudo deve carregar instantaneamente, sem loading screens

---

## 5. Entregável

Um arquivo `index.html` completo, funcional, bonito e pronto pra usar. O usuário abre no navegador e começa a usar imediatamente. Todos os dados ficam no localStorage do browser.
