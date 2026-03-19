# Design Spec — BJJ GI Study Tracker v2

## Visão Geral

Single-page application para estudo interativo de Jiu-Jitsu GI, voltada para um faixa azul de 85kg que treina contra oponentes pesados (100kg+). Persistência via localStorage, dark theme, mobile-first.

**Stack:** Vanilla JS com Web Components (Custom Elements), múltiplos arquivos, sem build step, sem dependências além de Google Fonts.

---

## 1. Arquitetura

### Estrutura de Arquivos

```
/
├── index.html
├── css/
│   └── style.css              (tema dark, variáveis CSS, responsivo)
├── js/
│   ├── app.js                 (inicialização, router de tabs)
│   ├── storage.js             (localStorage wrapper, export/import)
│   └── data.js                (conteúdo dos módulos hardcoded)
├── components/
│   ├── app-shell.js           (layout principal, bottom tabs, hamburguer)
│   ├── tab-modules.js         (tab Módulos — grid de cards)
│   ├── tab-gameplan.js        (tab Game Plan — árvore Se/Então)
│   ├── tab-training.js        (tab Treino — log + mini stats)
│   ├── tab-config.js          (tab Config — export/import/reset)
│   ├── module-card.js         (card de módulo individual)
│   ├── module-detail.js       (módulo expandido com conceitos/recursos)
│   ├── study-checkbox.js      (checkbox com timestamp)
│   ├── progress-bar.js        (barra de progresso animada)
│   ├── gameplan-tree.js       (árvore de decisão por posição)
│   ├── gameplan-node.js       (nó individual Se/Então com notas)
│   ├── training-form.js       (form de registro de treino)
│   ├── training-log.js        (lista de treinos)
│   ├── training-stats.js      (mini-dashboard de estatísticas)
│   └── chip-select.js         (seletor de chips multi-select)
└── assets/
```

### Navegação

4 tabs via hash routing (`#modules`, `#gameplan`, `#training`, `#config`):
- **Módulos** (`#modules`) — estudo dos conceitos e recursos (default)
- **Game Plan** (`#gameplan`) — árvore de decisões por posição
- **Treino** (`#training`) — log + estatísticas + finalizações em foco
- **Config** (`#config`) — export/import/reset (ícone engrenagem, discreto)

Listener de `hashchange` alterna a tab visível. Suporta botão voltar do browser e bookmark direto.

### Interação Módulos: Card → Detail

- **Mobile:** clicar num module-card substitui o grid pela view de detalhe (module-detail) com botão voltar no topo
- **Desktop:** mesma abordagem (full view swap) — simples e consistente

### Comunicação entre Componentes

- Custom Events para comunicação entre componentes
- `storage.js` como fonte central de dados (wrapper do localStorage)
- Auto-save em toda interação (checkbox, nota, log)

### Responsividade

- **Mobile (< 768px):** Bottom tab bar fixo, cards full-width, tudo em coluna
- **Desktop (>= 768px):** Sidebar fixa à esquerda com navegação, conteúdo ao lado, cards em grid 2 colunas

---

## 2. Módulos de Estudo

7 módulos, cada um com conceitos-chave (checkboxes), recursos (com checkbox de assistido/lido), e erros comuns (quando aplicável).

### Módulo 1 — Corrigir o Bow and Arrow
**Prioridade: URGENTE**

Conceitos-chave:
- Mão DIREITA na gola → cair pro lado DIREITO (mesmo lado da mão que estrangula)
- Seatbelt grip firme + hooks travados antes de iniciar
- Pegada funda na gola — polegar por dentro tocando a clavícula
- Girar 90 graus (ficar perpendicular ao oponente) antes de finalizar
- Mão livre agarra calça no joelho da perna distante (impede barrel roll)
- Estender o corpo puxando gola + joelho como arco e flecha
- Perna perto da cabeça pode passar panturrilha no bíceps dele
- Alternativa: Zipper Choke (Roger Gracie) — pegada dupla na gola sem mudar ângulo

Recursos:
- 🎥 Buchecha — Bow and Arrow passo a passo (GI) → https://www.youtube.com/watch?v=TfDt15dbgLk
- 🎥 Professor Leandro — Finalizações das costas GI (PT) → https://www.youtube.com/watch?v=HWValclCydg
- 📝 BJJ Fanatics — "Master The Bow & Arrow Step-By-Step" com Lachlan Giles (EN)
- 📝 Grapplearts — "How To Do the Bow and Arrow Choke" com Emily Kwok (EN)
- 📝 Graciemag — "Aprenda a finalizar no arco e flecha com Ricardo Franjinha" (PT)
- 📝 Evolve Daily — "How To Complete The Bow And Arrow Choke" com Teco Shinzato (EN)

5 erros comuns (lista visual, não checkbox):
1. Cair pro lado errado (cria espaço pro escape)
2. Pegada rasa na gola (precisa ser profunda)
3. Não segurar calça/perna (permite barrel roll)
4. Não girar 90 graus antes de finalizar
5. Lapela passando sobre o queixo (vira dor, não choke real)

### Módulo 2 — Retenção de Montada (Mount Retention)
**Prioridade: ALTA**

Conceitos-chave:
- Peso TODO no quadril dele, NÃO nos joelhos
- Sistema progressivo: Low Mount → High Mount → Technical Mount
- Low mount: joelhos apertados nas costelas, quadril pesado no abdômen
- Se ele tenta elbow-knee escape → subir pra high mount
- Se ele coloca um cotovelo → transitar pra technical mount (cadeirinha)
- Controlar ombros no tatame (escapes começam com ombro)
- Ataques duplos: gola + braço (dilema: defende pescoço = abre armlock)
- Reagir ANTES que o oponente complete o setup da fuga
- Neutralizar as 2 fugas: upa (bridge and roll) e recomposição de guarda (elbow-knee)
- No GI: pegada de gola = arma principal na montada
- **Grapevines (travas de perna) pra neutralizar a upa**
- **Quando ele faz ponte: postar mão no tatame + redistribuir peso (não lutar contra)**
- **Transição montada → S-mount como alternativa a high mount**
- **Cross-grip na gola oposta pra travar ombro no chão**
- **"Surfar" o movimento dele — acompanhar o quadril em vez de resistir**

Recursos:
- 🎥 Rayron Gracie — Retenção de montada GI → https://www.youtube.com/watch?v=vXnXBOVppu8
- 📝 Graciemag — "10 Dicas para Melhorar Sua Montada" (PT) → https://www.graciemag.com/onde-voce-tem-errado-ao-montar-10-dicas-de-jiu-jitsu-para-melhorar-sua-montada/
- 🎥 Emily Kwok & Stephan Kesting — "How to Stabilise Mount Against Bigger Opponent" (EN, Grapplearts)
- 📝 Roger Gracie Key Concepts for Mount (bjjee.com, EN)
- 📝 Venum Blog — "Dicas para Melhorar Sua Montada" (PT)

### Módulo 3 — Controle de Costas no GI (Back Control)
**Prioridade: ALTA**

Conceitos-chave:
- Costas = posição dominante mais segura contra pesados (peso deles é irrelevante)
- Seatbelt grip: braço por cima do ombro + braço por baixo da axila
- Mão de baixo cobre a mão de cima (dificulta grip fighting dele)
- Pegadas de GI: gola (ameaça choke), faixa/cintura (controla quadril), calça no joelho
- Vencer o grip fighting: descolar braço de cima dele → controlar pulso → puxar braço atrás das costas → entrar com choke
- Se defender a pegada de gola → trocar de lado (underhook vira mão de choke)
- Finalizações por prioridade: Bow and Arrow > Zipper Choke > Sliding Collar > Mata Leão > Ezekiel pela manga
- **Body triangle vs hooks — contra pesados, body triangle segura mais**
- **Se ele descola o seatbelt → recompor ANTES que vire de frente**
- **Regra: "nunca largar as duas mãos ao mesmo tempo"**
- **Se ele escapa pra um lado → transitar pra turtle control → re-take**
- **Controle do quadril com os calcanhares (não deixar ele sentar no chão)**

Recursos:
- 📝 Jiu Jitsu Legacy — "Never Lose BJJ Back Control: Human Backpack" (EN, gratuito)
- 📝 Gracie Barra — "A Posição Suprema - Ataques das Costas" (PT)
- 📝 BJJ Notícias — "Pegada pelas Costas no Jiu-Jitsu" (PT)

### Módulo 4 — Contra Oponentes Pesados (85kg vs 100kg+)
**Prioridade: MÉDIA**

Conceitos-chave:
- Costas > Montada contra pesados (na montada ele te joga, nas costas o peso é irrelevante)
- Chokes > Joint locks (não existe cara durão pra estrangulamento)
- Evitar: armbar, triângulo (difícil fechar), arm triangle, kimura (disputa de força)
- Guardas de distância: Spider, Lasso, Butterfly (força das pernas > braços)
- Evitar closed guard (ele empilha peso)
- Passagem: speed passes (toreando, leg drag) — NÃO pressure passes
- Controle distância com grips no quadril + pé no bíceps
- Buscar ângulos laterais (nunca ficar de frente)
- Half guard com underhook + arm drag → back take
- 90% paciência, 10% explosão — pesado gasta mais energia por minuto

Recursos:
- 🎥 Vídeo em PT — Dicas contra pesados → https://www.youtube.com/watch?v=iuDuTL84Hcw
- 📝 Loja do Kimono — "21 Estratégias para Vencer Adversários Maiores" (PT)
- 📝 In The Guard — "18 Dicas Contra Lutadores Maiores" (PT)
- 📝 BJJ World — "7 Strategies to Defeat Bigger Opponents" (EN)
- 💰 Bruno Malfacine — "Como Lutar Contra o Adversário Maior" (BJJ Fanatics BR, pago)

### Módulo 5 — Grip Fighting no GI
**Prioridade: MÉDIA**

Conceitos-chave:
- Quebrar grips do oponente PRIMEIRO antes de impor os seus
- "Decoy grips" — pegadas falsas pra abrir a real
- Não fazer death-grip (queima antebraço) — usar pegadas inteligentes
- Tirar pegadas desnecessárias do oponente imediatamente
- Usar frames ósseos (esqueleto) em vez de força muscular
- No GI: gola = controle grátis, aproveitar isso

Recursos:
- 🎥 Jordan Teaches Jiu-Jitsu — Grip Fighting Guide (EN, fácil) → https://www.youtube.com/watch?v=n6EUwvCkWJ8
- 🎥 Chewjitsu — 4 Princípios de Grip Fighting (EN, prático) → https://www.youtube.com/watch?v=7kamw42pMIc

### Módulo 6 — Gestão de Energia e Respiração
**Prioridade: MÉDIA**

Conceitos-chave:
- Problema NÃO é falta de cardio — é excesso de tensão muscular
- Respiração diafragmática (barriga, não peito)
- Exalar ativamente durante movimentos (sons: "chá", "shu")
- Se respira pelo nariz = ritmo sustentável; pela boca = tá no vermelho
- Preso embaixo de pesado → virar de lado (respirar é 10x mais fácil de lado)
- Power hips: um pé plantado, outra perna estendida → cria espaço pra respirar
- Evitar a todo custo ficar preso no side control por baixo (mais drena energia)
- Drills devagar no começo do treino (montada + costas) = endurance técnica

Recursos:
- 📝 Rílion Gracie Trindade — "Gás no Jiu Jitsu: 5 Dicas para Cansar Menos" (PT)
- 📝 BJJ Fanatics BR — "Pare De Fazer Força Desnecessária" (PT)
- 🎥 Stephan Kesting — Breathing under pressure (EN, Grapplearts)

### Módulo 7 (NOVO) — Side Control por Cima
**Prioridade: ALTA**

Conceitos-chave:
- Kuzure kesa gatame (100 kilos) como posição default de controle
- Underhook no braço longe + crossface = ele não vira
- Transições: side control → mount (knee slide), side control → costas (quando ele vira), side control → norte-sul
- Não ficar flat — ângulo de 45° com pressão de ombro
- Usar joelho na cintura pra bloquear recomposição de guarda
- Gi grips: gola + calça pra travar

Recursos:
- 🎥 (a pesquisar: vídeo de side control retention GI em PT)
- 🎥 (a pesquisar: vídeo de side control transitions GI em EN)
- Nota: renderizar placeholder "Recursos em breve" até os links serem adicionados

---

## 3. Game Plan (Cards Se/Então)

### Estrutura

Organizado por posição. Cada posição tem nós de decisão em formato de árvore. Dados hardcoded como ponto de partida + nós editáveis pelo usuário.

O usuário pode:
- Adicionar nós novos
- Editar texto de qualquer nó
- Adicionar anotações pessoais em cada nó (campo de texto livre)
- Deletar nós que criou (hardcoded não são deletáveis)

### Visual

- Cada posição é um card expansível
- Árvore usa indentação CSS com linhas conectoras
- Cada nó tem ícone de "editar" e "anotar"
- Nós do usuário: borda tracejada pra distinguir dos hardcoded

### Posições Pré-populadas

**Costas (você atrás)**
```
Costas com seatbelt
  ├─ Ele defende a gola → troca de lado (underhook vira mão de choke)
  ├─ Ele tenta sentar no chão → body triangle + puxar pra trás
  ├─ Ele descola seatbelt → recompor grip ANTES que vire
  ├─ Gola aberta → Bow and Arrow
  └─ Gola fechada → Mata Leão / Zipper Choke
```

**Montada**
```
Low Mount
  ├─ Ele faz upa → postar mão + surfar → volta
  ├─ Ele faz elbow-knee → subir pra High Mount
  ├─ Ele fica parado → atacar gola (cross choke / ezekiel)
  └─ Ele coloca cotovelo → Technical Mount
      ├─ Bow and Arrow
      └─ Armbar (se ele for mais leve)
```

**Side Control (você em cima)**
```
Kuzure / 100 kilos
  ├─ Ele empurra → montar (knee slide)
  ├─ Ele vira de costas → back take
  ├─ Ele fica parado → norte-sul / kimura
  └─ Ele tenta recompor guarda → joelho na cintura + crossface
```

**Half Guard (você por cima)**
```
Half Guard top
  ├─ Ele tem underhook → whizzer + crossface
  ├─ Ele flat → shoulder pressure + liberar perna
  └─ Ele puxa deep half → sprawl + back step
```

---

## 4. Log de Treinos + Mini-Dashboard

### Form de Registro

Campos:
- **Data** (default: hoje)
- **Duração** (30min, 1h, 1h30, 2h — select)
- **O que treinei** (texto livre, 2-3 linhas)
- **Posições que peguei** (chips: Montada, Costas, Side Control, Meia-guarda, Guarda, Passagem)
- **Posições que perdi** (mesmos chips)
- **Finalizações que tentei** (chips da lista de finalizações)
- **Finalizações que peguei** (chips da lista)
- **Humor pós-treino** (😤 😐 😊 🔥)

### Mini-Dashboard de Estatísticas

Cards acima da lista de treinos:
- **Total de treinos** (últimas 4 semanas + total geral)
- **Streak** (semanas consecutivas com treino)
- **Posições mais pegadas** (top 3 com contagem)
- **Posições mais perdidas** (top 3 com contagem)
- **Taxa de finalização** (tentei X, peguei Y = Z%)
- **Finalizações mais efetivas** (top 3 por taxa de sucesso)

### Lista de Treinos

- Cronológica (mais recente primeiro)
- Card compacto: data, duração, emoji, chips das posições
- Expande pra ver detalhes
- Filtro por período (última semana / último mês / tudo)

### Finalizações em Foco

Sub-seção dentro da tab Treino:
- Selecionar finalizações em foco (Bow and Arrow, Zipper Choke, Sliding Collar, Cross Choke, Mata Leão, Ezekiel pela manga, Guilhotina, Omoplata, Loop Choke, Clock Choke)
- Pra cada uma: notas pessoais, contador tentei/peguei, taxa de sucesso automática

---

## 5. Config

### Tab Config (ícone engrenagem)

- **Exportar Dados** — download JSON `bjj-tracker-backup-YYYY-MM-DD.json`
- **Importar Dados** — upload JSON com preview antes de confirmar
- **Resetar Tudo** — confirmação dupla

### Canais Recomendados (dentro da tab Módulos, no final)

Lista fixa estilizada:
- Feu BJJ (PT), AOJ (EN), Chewjitsu (EN), Lachlan Giles (EN), Bernardo Faria (EN), BJJ Scout (EN), Jordan Teaches Jiujitsu (EN), Stephan Kesting (EN), Keenan Cornelius (EN), IBJJF Oficial

---

## 6. Modelo de Dados e Persistência

### Constantes Compartilhadas (data.js)

Slugs canônicos usados em módulos, game plan e training:

```js
const POSITIONS = [
  "montada", "costas", "side-control", "meia-guarda", "guarda", "passagem", "turtle", "norte-sul"
];

const SUBMISSIONS = [
  "bow-and-arrow", "zipper-choke", "sliding-collar", "cross-choke",
  "mata-leao", "ezekiel", "guilhotina", "omoplata", "loop-choke", "clock-choke"
];

const MOODS = [
  { value: "frustrated", emoji: "😤" },
  { value: "neutral", emoji: "😐" },
  { value: "happy", emoji: "😊" },
  { value: "fire", emoji: "🔥" }
];
```

### Esquema de IDs

- **Módulos:** slug descritivo — `"bow-and-arrow"`, `"mount-retention"`, `"back-control"`, `"vs-heavyweights"`, `"grip-fighting"`, `"energy-breathing"`, `"side-control-top"`
- **Conceitos:** `"{module-slug}-c{N}"` — ex: `"bow-and-arrow-c1"`, `"mount-retention-c5"`
- **Recursos:** `"{module-slug}-r{N}"` — ex: `"bow-and-arrow-r1"`
- **Game plan nodes (hardcoded):** `"{position}-n{N}"` — ex: `"costas-n1"`, `"montada-n3"`
- **Game plan nodes (usuário):** `crypto.randomUUID()` — ex: `"a1b2c3d4-..."`
- **Training logs:** `crypto.randomUUID()`

### Shapes dos Objetos

**Game plan node:**
```js
{
  id: "costas-n1",
  parentId: null,              // null = root node
  trigger: "Ele defende a gola",
  response: "troca de lado (underhook vira mão de choke)",
  children: ["costas-n2", "costas-n3"],
  isUserCreated: false,
  note: ""                     // anotação pessoal do usuário
}
```

**Training log entry:**
```js
{
  id: "uuid-...",
  date: "2026-03-18",
  duration: "1h",
  notes: "Treinei passagem e side control...",
  positionsGot: ["costas", "montada"],
  positionsLost: ["side-control"],
  submissionsAttempted: ["bow-and-arrow", "mata-leao"],
  submissionsLanded: ["bow-and-arrow"],
  mood: "fire",
  createdAt: "2026-03-18T19:30:00.000Z"
}
```

**Focus submission:**
```js
{
  slug: "bow-and-arrow",
  tried: 5,
  finished: 3,
  notes: "Funcionou contra o fulano de 95kg na terça"
}
```

### Estrutura do localStorage

```js
{
  schemaVersion: 1,
  modules: {
    "bow-and-arrow": {
      concepts: { "bow-and-arrow-c1": { checked: true, date: "2026-03-18T..." } },
      resources: { "bow-and-arrow-r1": { checked: true, date: "2026-03-18T..." } }
    }
    // ... demais módulos
  },
  gameplan: {
    "costas": {
      overrides: { "costas-n1": { note: "minha anotação", trigger: null, response: null } },
      userNodes: { "uuid-...": { /* node shape, isUserCreated: true */ } }
    }
    // ... demais posições (hardcoded nodes live in data.js, NOT in storage)
  },
  training: {
    logs: [ /* training log entries */ ],
    focusSubmissions: {
      "bow-and-arrow": { tried: 5, finished: 3, notes: "..." }
    }
  }
}
```

### Limites e Erros

- `storage.js` captura `QuotaExceededError` em toda escrita e mostra mensagem: "Storage cheio. Exporte seus dados e limpe treinos antigos."
- Tab Config mostra uso atual do storage (KB usados / ~5MB)
- Campo `schemaVersion` no export permite detectar backups incompatíveis no import

---

## 7. Design e Estética

- **Dark mode:** fundo ~#0a0a0f, texto claro
- **Acento principal:** azul profundo (#2563eb / #3b82f6) — remetendo à faixa azul
- **Acento secundário:** vermelho/coral pra tags URGENTE
- **Tipografia:** Google Fonts — título display + corpo sans-serif
- **Tags de prioridade:** URGENTE = vermelho, ALTA = amber, MÉDIA = azul
- **Tags de idioma:** PT = verde, EN = azul claro
- **Animações:** micro-feedback em checkboxes, barras de progresso animadas
- **100% módulo:** badge de conclusão (ícone checkmark + cor diferenciada no card)
- **Estado vazio:** mensagem motivacional quando não tem treinos
