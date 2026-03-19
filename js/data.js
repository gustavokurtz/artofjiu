// js/data.js

export const POSITIONS = [
  "montada", "costas", "side-control", "meia-guarda", "guarda", "passagem", "turtle", "norte-sul"
];

export const SUBMISSIONS = [
  "bow-and-arrow", "zipper-choke", "sliding-collar", "cross-choke",
  "mata-leao", "ezekiel", "guilhotina", "omoplata", "loop-choke", "clock-choke"
];

export const MOODS = [
  { value: "frustrated", emoji: "😤" },
  { value: "neutral", emoji: "😐" },
  { value: "happy", emoji: "😊" },
  { value: "fire", emoji: "🔥" }
];

export const POSITION_LABELS = {
  "montada": "Montada", "costas": "Costas", "side-control": "Side Control",
  "meia-guarda": "Meia-guarda", "guarda": "Guarda", "passagem": "Passagem",
  "turtle": "Turtle", "norte-sul": "Norte-Sul"
};

export const SUBMISSION_LABELS = {
  "bow-and-arrow": "Bow and Arrow", "zipper-choke": "Zipper Choke",
  "sliding-collar": "Sliding Collar", "cross-choke": "Cross Choke",
  "mata-leao": "Mata Leão", "ezekiel": "Ezekiel pela Manga",
  "guilhotina": "Guilhotina", "omoplata": "Omoplata",
  "loop-choke": "Loop Choke", "clock-choke": "Clock Choke"
};

export const MODULES = [
  {
    slug: "bow-and-arrow",
    title: "Corrigir o Bow and Arrow",
    priority: "urgente",
    concepts: [
      { id: "bow-and-arrow-c1", text: "Mão DIREITA na gola → cair pro lado DIREITO (mesmo lado da mão que estrangula)" },
      { id: "bow-and-arrow-c2", text: "Seatbelt grip firme + hooks travados antes de iniciar" },
      { id: "bow-and-arrow-c3", text: "Pegada funda na gola — polegar por dentro tocando a clavícula" },
      { id: "bow-and-arrow-c4", text: "Girar 90 graus (ficar perpendicular ao oponente) antes de finalizar" },
      { id: "bow-and-arrow-c5", text: "Mão livre agarra calça no joelho da perna distante (impede barrel roll)" },
      { id: "bow-and-arrow-c6", text: "Estender o corpo puxando gola + joelho como arco e flecha" },
      { id: "bow-and-arrow-c7", text: "Perna perto da cabeça pode passar panturrilha no bíceps dele" },
      { id: "bow-and-arrow-c8", text: "Alternativa: Zipper Choke (Roger Gracie) — pegada dupla na gola sem mudar ângulo" }
    ],
    resources: [
      { id: "bow-and-arrow-r1", type: "video", lang: "pt", title: "Buchecha — Bow and Arrow passo a passo (GI)", url: "https://www.youtube.com/watch?v=TfDt15dbgLk" },
      { id: "bow-and-arrow-r2", type: "video", lang: "pt", title: "Professor Leandro — Finalizações das costas GI (PT)", url: "https://www.youtube.com/watch?v=HWValclCydg" },
      { id: "bow-and-arrow-r3", type: "article", lang: "en", title: "BJJ Fanatics — \"Master The Bow & Arrow Step-By-Step\" com Lachlan Giles" },
      { id: "bow-and-arrow-r4", type: "article", lang: "en", title: "Grapplearts — \"How To Do the Bow and Arrow Choke\" com Emily Kwok" },
      { id: "bow-and-arrow-r5", type: "article", lang: "pt", title: "Graciemag — \"Aprenda a finalizar no arco e flecha com Ricardo Franjinha\"" },
      { id: "bow-and-arrow-r6", type: "article", lang: "en", title: "Evolve Daily — \"How To Complete The Bow And Arrow Choke\" com Teco Shinzato" }
    ],
    commonErrors: [
      "Cair pro lado errado (cria espaço pro escape)",
      "Pegada rasa na gola (precisa ser profunda)",
      "Não segurar calça/perna (permite barrel roll)",
      "Não girar 90 graus antes de finalizar",
      "Lapela passando sobre o queixo (vira dor, não choke real)"
    ]
  },
  {
    slug: "mount-retention",
    title: "Retenção de Montada (Mount Retention)",
    priority: "alta",
    concepts: [
      { id: "mount-retention-c1", text: "Peso TODO no quadril dele, NÃO nos joelhos" },
      { id: "mount-retention-c2", text: "Sistema progressivo: Low Mount → High Mount → Technical Mount" },
      { id: "mount-retention-c3", text: "Low mount: joelhos apertados nas costelas, quadril pesado no abdômen" },
      { id: "mount-retention-c4", text: "Se ele tenta elbow-knee escape → subir pra high mount" },
      { id: "mount-retention-c5", text: "Se ele coloca um cotovelo → transitar pra technical mount (cadeirinha)" },
      { id: "mount-retention-c6", text: "Controlar ombros no tatame (escapes começam com ombro)" },
      { id: "mount-retention-c7", text: "Ataques duplos: gola + braço (dilema: defende pescoço = abre armlock)" },
      { id: "mount-retention-c8", text: "Reagir ANTES que o oponente complete o setup da fuga" },
      { id: "mount-retention-c9", text: "Neutralizar as 2 fugas: upa (bridge and roll) e recomposição de guarda (elbow-knee)" },
      { id: "mount-retention-c10", text: "No GI: pegada de gola = arma principal na montada" },
      { id: "mount-retention-c11", text: "Grapevines (travas de perna) pra neutralizar a upa" },
      { id: "mount-retention-c12", text: "Quando ele faz ponte: postar mão no tatame + redistribuir peso (não lutar contra)" },
      { id: "mount-retention-c13", text: "Transição montada → S-mount como alternativa a high mount" },
      { id: "mount-retention-c14", text: "Cross-grip na gola oposta pra travar ombro no chão" },
      { id: "mount-retention-c15", text: "\"Surfar\" o movimento dele — acompanhar o quadril em vez de resistir" }
    ],
    resources: [
      { id: "mount-retention-r1", type: "video", lang: "pt", title: "Rayron Gracie — Retenção de montada GI", url: "https://www.youtube.com/watch?v=vXnXBOVppu8" },
      { id: "mount-retention-r2", type: "article", lang: "pt", title: "Graciemag — \"10 Dicas para Melhorar Sua Montada\"", url: "https://www.graciemag.com/onde-voce-tem-errado-ao-montar-10-dicas-de-jiu-jitsu-para-melhorar-sua-montada/" },
      { id: "mount-retention-r3", type: "video", lang: "en", title: "Emily Kwok & Stephan Kesting — \"How to Stabilise Mount Against Bigger Opponent\" (Grapplearts)" },
      { id: "mount-retention-r4", type: "article", lang: "en", title: "Roger Gracie Key Concepts for Mount (bjjee.com)" },
      { id: "mount-retention-r5", type: "article", lang: "pt", title: "Venum Blog — \"Dicas para Melhorar Sua Montada\"" }
    ]
  },
  {
    slug: "back-control",
    title: "Controle de Costas no GI (Back Control)",
    priority: "alta",
    concepts: [
      { id: "back-control-c1", text: "Costas = posição dominante mais segura contra pesados (peso deles é irrelevante)" },
      { id: "back-control-c2", text: "Seatbelt grip: braço por cima do ombro + braço por baixo da axila" },
      { id: "back-control-c3", text: "Mão de baixo cobre a mão de cima (dificulta grip fighting dele)" },
      { id: "back-control-c4", text: "Pegadas de GI: gola (ameaça choke), faixa/cintura (controla quadril), calça no joelho" },
      { id: "back-control-c5", text: "Vencer o grip fighting: descolar braço de cima dele → controlar pulso → puxar braço atrás das costas → entrar com choke" },
      { id: "back-control-c6", text: "Se defender a pegada de gola → trocar de lado (underhook vira mão de choke)" },
      { id: "back-control-c7", text: "Finalizações por prioridade: Bow and Arrow > Zipper Choke > Sliding Collar > Mata Leão > Ezekiel pela manga" },
      { id: "back-control-c8", text: "Body triangle vs hooks — contra pesados, body triangle segura mais" },
      { id: "back-control-c9", text: "Se ele descola o seatbelt → recompor ANTES que vire de frente" },
      { id: "back-control-c10", text: "Regra: \"nunca largar as duas mãos ao mesmo tempo\"" },
      { id: "back-control-c11", text: "Se ele escapa pra um lado → transitar pra turtle control → re-take" },
      { id: "back-control-c12", text: "Controle do quadril com os calcanhares (não deixar ele sentar no chão)" }
    ],
    resources: [
      { id: "back-control-r1", type: "article", lang: "en", title: "Jiu Jitsu Legacy — \"Never Lose BJJ Back Control: Human Backpack\"" },
      { id: "back-control-r2", type: "article", lang: "pt", title: "Gracie Barra — \"A Posição Suprema - Ataques das Costas\"" },
      { id: "back-control-r3", type: "article", lang: "pt", title: "BJJ Notícias — \"Pegada pelas Costas no Jiu-Jitsu\"" }
    ]
  },
  {
    slug: "vs-heavyweights",
    title: "Contra Oponentes Pesados (85kg vs 100kg+)",
    priority: "media",
    concepts: [
      { id: "vs-heavyweights-c1", text: "Costas > Montada contra pesados (na montada ele te joga, nas costas o peso é irrelevante)" },
      { id: "vs-heavyweights-c2", text: "Chokes > Joint locks (não existe cara durão pra estrangulamento)" },
      { id: "vs-heavyweights-c3", text: "Evitar: armbar, triângulo (difícil fechar), arm triangle, kimura (disputa de força)" },
      { id: "vs-heavyweights-c4", text: "Guardas de distância: Spider, Lasso, Butterfly (força das pernas > braços)" },
      { id: "vs-heavyweights-c5", text: "Evitar closed guard (ele empilha peso)" },
      { id: "vs-heavyweights-c6", text: "Passagem: speed passes (toreando, leg drag) — NÃO pressure passes" },
      { id: "vs-heavyweights-c7", text: "Controle distância com grips no quadril + pé no bíceps" },
      { id: "vs-heavyweights-c8", text: "Buscar ângulos laterais (nunca ficar de frente)" },
      { id: "vs-heavyweights-c9", text: "Half guard com underhook + arm drag → back take" },
      { id: "vs-heavyweights-c10", text: "90% paciência, 10% explosão — pesado gasta mais energia por minuto" }
    ],
    resources: [
      { id: "vs-heavyweights-r1", type: "video", lang: "pt", title: "Dicas contra pesados", url: "https://www.youtube.com/watch?v=iuDuTL84Hcw" },
      { id: "vs-heavyweights-r2", type: "article", lang: "pt", title: "Loja do Kimono — \"21 Estratégias para Vencer Adversários Maiores\"" },
      { id: "vs-heavyweights-r3", type: "article", lang: "pt", title: "In The Guard — \"18 Dicas Contra Lutadores Maiores\"" },
      { id: "vs-heavyweights-r4", type: "article", lang: "en", title: "BJJ World — \"7 Strategies to Defeat Bigger Opponents\"" },
      { id: "vs-heavyweights-r5", type: "paid", lang: "pt", title: "Bruno Malfacine — \"Como Lutar Contra o Adversário Maior\" (BJJ Fanatics BR, pago)" }
    ]
  },
  {
    slug: "grip-fighting",
    title: "Grip Fighting no GI",
    priority: "media",
    concepts: [
      { id: "grip-fighting-c1", text: "Quebrar grips do oponente PRIMEIRO antes de impor os seus" },
      { id: "grip-fighting-c2", text: "\"Decoy grips\" — pegadas falsas pra abrir a real" },
      { id: "grip-fighting-c3", text: "Não fazer death-grip (queima antebraço) — usar pegadas inteligentes" },
      { id: "grip-fighting-c4", text: "Tirar pegadas desnecessárias do oponente imediatamente" },
      { id: "grip-fighting-c5", text: "Usar frames ósseos (esqueleto) em vez de força muscular" },
      { id: "grip-fighting-c6", text: "No GI: gola = controle grátis, aproveitar isso" }
    ],
    resources: [
      { id: "grip-fighting-r1", type: "video", lang: "en", title: "Jordan Teaches Jiu-Jitsu — Grip Fighting Guide", url: "https://www.youtube.com/watch?v=n6EUwvCkWJ8" },
      { id: "grip-fighting-r2", type: "video", lang: "en", title: "Chewjitsu — 4 Princípios de Grip Fighting", url: "https://www.youtube.com/watch?v=7kamw42pMIc" }
    ]
  },
  {
    slug: "energy-breathing",
    title: "Gestão de Energia e Respiração",
    priority: "media",
    concepts: [
      { id: "energy-breathing-c1", text: "Problema NÃO é falta de cardio — é excesso de tensão muscular" },
      { id: "energy-breathing-c2", text: "Respiração diafragmática (barriga, não peito)" },
      { id: "energy-breathing-c3", text: "Exalar ativamente durante movimentos (sons: \"chá\", \"shu\")" },
      { id: "energy-breathing-c4", text: "Se respira pelo nariz = ritmo sustentável; pela boca = tá no vermelho" },
      { id: "energy-breathing-c5", text: "Preso embaixo de pesado → virar de lado (respirar é 10x mais fácil de lado)" },
      { id: "energy-breathing-c6", text: "Power hips: um pé plantado, outra perna estendida → cria espaço pra respirar" },
      { id: "energy-breathing-c7", text: "Evitar a todo custo ficar preso no side control por baixo (mais drena energia)" },
      { id: "energy-breathing-c8", text: "Drills devagar no começo do treino (montada + costas) = endurance técnica" }
    ],
    resources: [
      { id: "energy-breathing-r1", type: "article", lang: "pt", title: "Rílion Gracie Trindade — \"Gás no Jiu Jitsu: 5 Dicas para Cansar Menos\"" },
      { id: "energy-breathing-r2", type: "article", lang: "pt", title: "BJJ Fanatics BR — \"Pare De Fazer Força Desnecessária\"" },
      { id: "energy-breathing-r3", type: "video", lang: "en", title: "Stephan Kesting — Breathing under pressure (Grapplearts)" }
    ]
  },
  {
    slug: "side-control-top",
    title: "Side Control por Cima",
    priority: "alta",
    concepts: [
      { id: "side-control-top-c1", text: "Kuzure kesa gatame (100 kilos) como posição default de controle" },
      { id: "side-control-top-c2", text: "Underhook no braço longe + crossface = ele não vira" },
      { id: "side-control-top-c3", text: "Transições: side control → mount (knee slide), side control → costas (quando ele vira), side control → norte-sul" },
      { id: "side-control-top-c4", text: "Não ficar flat — ângulo de 45° com pressão de ombro" },
      { id: "side-control-top-c5", text: "Usar joelho na cintura pra bloquear recomposição de guarda" },
      { id: "side-control-top-c6", text: "Gi grips: gola + calça pra travar" }
    ],
    resources: [
      { id: "side-control-top-r1", type: "video", lang: "pt", title: "(a pesquisar: vídeo de side control retention GI em PT)", url: null, placeholder: true },
      { id: "side-control-top-r2", type: "video", lang: "en", title: "(a pesquisar: vídeo de side control transitions GI em EN)", url: null, placeholder: true }
    ]
  }
];

export const GAMEPLAN_TREES = {
  costas: {
    title: "Costas (você atrás)",
    rootId: "costas-n1",
    nodes: {
      "costas-n1": { id: "costas-n1", parentId: null, trigger: null, response: "Costas com seatbelt", children: ["costas-n2", "costas-n3", "costas-n4", "costas-n5", "costas-n6"], isUserCreated: false, note: "" },
      "costas-n2": { id: "costas-n2", parentId: "costas-n1", trigger: "Ele defende a gola", response: "troca de lado (underhook vira mão de choke)", children: [], isUserCreated: false, note: "" },
      "costas-n3": { id: "costas-n3", parentId: "costas-n1", trigger: "Ele tenta sentar no chão", response: "body triangle + puxar pra trás", children: [], isUserCreated: false, note: "" },
      "costas-n4": { id: "costas-n4", parentId: "costas-n1", trigger: "Ele descola seatbelt", response: "recompor grip ANTES que vire", children: [], isUserCreated: false, note: "" },
      "costas-n5": { id: "costas-n5", parentId: "costas-n1", trigger: "Gola aberta", response: "Bow and Arrow", children: [], isUserCreated: false, note: "" },
      "costas-n6": { id: "costas-n6", parentId: "costas-n1", trigger: "Gola fechada", response: "Mata Leão / Zipper Choke", children: [], isUserCreated: false, note: "" }
    }
  },
  montada: {
    title: "Montada",
    rootId: "montada-n1",
    nodes: {
      "montada-n1": { id: "montada-n1", parentId: null, trigger: null, response: "Low Mount", children: ["montada-n2", "montada-n3", "montada-n4", "montada-n5"], isUserCreated: false, note: "" },
      "montada-n2": { id: "montada-n2", parentId: "montada-n1", trigger: "Ele faz upa", response: "postar mão + surfar → volta", children: [], isUserCreated: false, note: "" },
      "montada-n3": { id: "montada-n3", parentId: "montada-n1", trigger: "Ele faz elbow-knee", response: "subir pra High Mount", children: [], isUserCreated: false, note: "" },
      "montada-n4": { id: "montada-n4", parentId: "montada-n1", trigger: "Ele fica parado", response: "atacar gola (cross choke / ezekiel)", children: [], isUserCreated: false, note: "" },
      "montada-n5": { id: "montada-n5", parentId: "montada-n1", trigger: "Ele coloca cotovelo", response: "Technical Mount", children: ["montada-n6", "montada-n7"], isUserCreated: false, note: "" },
      "montada-n6": { id: "montada-n6", parentId: "montada-n5", trigger: null, response: "Bow and Arrow", children: [], isUserCreated: false, note: "" },
      "montada-n7": { id: "montada-n7", parentId: "montada-n5", trigger: null, response: "Armbar (se ele for mais leve)", children: [], isUserCreated: false, note: "" }
    }
  },
  "side-control": {
    title: "Side Control (você em cima)",
    rootId: "sc-n1",
    nodes: {
      "sc-n1": { id: "sc-n1", parentId: null, trigger: null, response: "Kuzure / 100 kilos", children: ["sc-n2", "sc-n3", "sc-n4", "sc-n5"], isUserCreated: false, note: "" },
      "sc-n2": { id: "sc-n2", parentId: "sc-n1", trigger: "Ele empurra", response: "montar (knee slide)", children: [], isUserCreated: false, note: "" },
      "sc-n3": { id: "sc-n3", parentId: "sc-n1", trigger: "Ele vira de costas", response: "back take", children: [], isUserCreated: false, note: "" },
      "sc-n4": { id: "sc-n4", parentId: "sc-n1", trigger: "Ele fica parado", response: "norte-sul / kimura", children: [], isUserCreated: false, note: "" },
      "sc-n5": { id: "sc-n5", parentId: "sc-n1", trigger: "Ele tenta recompor guarda", response: "joelho na cintura + crossface", children: [], isUserCreated: false, note: "" }
    }
  },
  "meia-guarda": {
    title: "Half Guard (você por cima)",
    rootId: "hg-n1",
    nodes: {
      "hg-n1": { id: "hg-n1", parentId: null, trigger: null, response: "Half Guard top", children: ["hg-n2", "hg-n3", "hg-n4"], isUserCreated: false, note: "" },
      "hg-n2": { id: "hg-n2", parentId: "hg-n1", trigger: "Ele tem underhook", response: "whizzer + crossface", children: [], isUserCreated: false, note: "" },
      "hg-n3": { id: "hg-n3", parentId: "hg-n1", trigger: "Ele flat", response: "shoulder pressure + liberar perna", children: [], isUserCreated: false, note: "" },
      "hg-n4": { id: "hg-n4", parentId: "hg-n1", trigger: "Ele puxa deep half", response: "sprawl + back step", children: [], isUserCreated: false, note: "" }
    }
  }
};

export const NOTE_TAGS = [
  "geral", "tecnica", "treino", "gameplan", "competicao", "professor"
];

export const NOTE_TAG_LABELS = {
  "geral": "Geral",
  "tecnica": "Técnica",
  "treino": "Treino",
  "gameplan": "Game Plan",
  "competicao": "Competição",
  "professor": "Perguntar ao Professor"
};

export const CHANNELS = [
  { name: "Feu BJJ", lang: "pt", description: "Maior canal BR de BJJ, GI, fundamentais" },
  { name: "Art of Jiu-Jitsu / AOJ", lang: "en", description: "Irmãos Mendes, GI 100%, sistemático" },
  { name: "Chewjitsu", lang: "en", description: "Blue belt tips, retenção, mentalidade" },
  { name: "Lachlan Giles / Submeta", lang: "en", description: "Giant killer, metódico, GI e NoGI" },
  { name: "Bernardo Faria", lang: "en", description: "5x mundial, sotaque BR fácil de entender" },
  { name: "BJJ Scout", lang: "en", description: "Análise visual pura, sem barreira de idioma" },
  { name: "Jordan Teaches Jiujitsu", lang: "en", description: "Conceitual, pronúncia clara" },
  { name: "Stephan Kesting", lang: "en", description: "Educacional, breathing, fundamentos" },
  { name: "Keenan Cornelius", lang: "en", description: "Jogo de lapela, worm guard, GI focado" },
  { name: "IBJJF Oficial", lang: null, description: "Lutas completas de mundiais" }
];
