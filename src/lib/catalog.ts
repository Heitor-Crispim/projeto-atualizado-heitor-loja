import napa from "@/assets/products/napa.jpg";
import napaEstampada from "@/assets/products/napa-estampada.jpg";
import corino from "@/assets/products/corino.jpg";
import bagum from "@/assets/products/bagum.jpg";
import capacho from "@/assets/products/capacho.jpg";
import gramaSintetica from "@/assets/products/grama-sintetica.jpg";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type ProductVariant = {
  code: string;
  color: string;
  hex: string;
  image?: string;
};

export type Product = {
  id: string;
  slug: string;
  code: string;
  name: string;
  category: string; // category slug
  shortDescription: string;
  description: string;
  image: string;
  sizes: string[];
  colors: string[];
  thickness?: string;
  material?: string;
  applications: string[];
  width?: string;
  length?: string;
  finish?: string;
  typeOfUse?: string;
  resistance?: string;
  purposes?: string[];
  applicationImages?: { url: string; caption: string }[];
  variants?: ProductVariant[];
  // Variações em formato de botões de seleção
  thicknessOptions?: string[];
  widthOptions?: string[];
  saleUnitOptions?: string[]; // ex.: "Metro Linear", "Rolo Fechado"
};

export const categories: Category[] = [
  { slug: "capachos", name: "Capachos", description: "Capachos de vinil para entradas de alto tráfego." },
  { slug: "bagum", name: "Bagum", description: "Material flexível e resistente em diversas cores." },
  { slug: "bagunzito", name: "Bagunzito", description: "Laminado Bagunzito em diversas cores vivas." },
  { slug: "corino", name: "Corino", description: "Revestimento resistente para móveis e estofados." },
  { slug: "napa", name: "Napa", description: "Acabamento sofisticado para estofados e revestimentos." },
  { slug: "grama-sintetica", name: "Grama Sintética", description: "Grama sintética 65.000 pontos, 10/12 mm." },
  { slug: "antiderrapante", name: "Tela Antiderrapante", description: "Tela antiderrapante para gavetas, prateleiras e tapetes." },
  { slug: "blackout", name: "Blackout", description: "Tecido corta-luz para cortinas e ambientes." },
  { slug: "carpete-forracao", name: "Carpete e Forração", description: "Carpetes, passadeiras e forrações." },
  { slug: "plastico-cristal", name: "Plástico Cristal", description: "Plásticos PVC cristal em várias espessuras." },
  { slug: "plastico-leitoso", name: "Plástico Leitoso", description: "Plástico leitoso colorido translúcido." },
  { slug: "lonas", name: "Lonas", description: "Lonas plásticas para coberturas e proteção." },
  { slug: "tnt", name: "TNT", description: "TNT liso, estampado e metalizado." },
  { slug: "verniz", name: "Verniz", description: "PVC Verniz 0,40 em ampla cartela de cores." },
  { slug: "toalhas-mesa", name: "Toalhas de Mesa", description: "Toalhas jacquard, rendadas, cristal e natalinas." },
  { slug: "tela-pvc", name: "Tela PVC JSerrano", description: "Telas PVC JSerrano linhas 100 e 300." },
  { slug: "juta", name: "Juta", description: "Juta aberta, fechada e com fios metalizados." },
  { slug: "suede", name: "Suede", description: "Suede liso, amassado e estampado." },
  { slug: "forros", name: "Forros e Protetores", description: "Forros de armário e protetores de geladeira." },
];


const baseColors = ["Branco", "Preto", "Vermelho", "Bege", "Cinza"];

// Helper to build variant codes consistently
const v = (code: string, color: string, hex: string): ProductVariant => ({ code, color, hex });

// ===== CAPACHO DE VINIL (catálogo oficial — 27 cores) =====
const capachoVariants: ProductVariant[] = [
  v("MA01", "Amarelo", "#F5C518"),
  v("MA02", "Azul Bebê", "#9EC8E8"),
  v("MA03", "Bege", "#C9A57A"),
  v("MA04", "Bordô", "#5B0E1A"),
  v("MA05", "Branco", "#F4F4F2"),
  v("MA06", "Cerâmica", "#C97B5E"),
  v("MA07", "Cinza", "#8A8A8A"),
  v("MA08", "Creme", "#EFE3CB"),
  v("MA09", "Ferrari", "#D2241C"),
  v("MA10", "Grafite", "#3A3A3A"),
  v("MA11", "Laranja", "#E65100"),
  v("MA12", "Marinho", "#0D1B3D"),
  v("MA13", "Marítimo", "#1B4F72"),
  v("MA14", "Marrom", "#5D3A1A"),
  v("MA15", "Ouro", "#C9A227"),
  v("MA16", "Pink", "#E91E63"),
  v("MA17", "Prata", "#BFC3C7"),
  v("MA18", "Preto", "#111111"),
  v("MA19", "Vermelho", "#C81E1E"),
  v("MA20", "Roxo", "#6A1B9A"),
  v("MA21", "Royal", "#1E40AF"),
  v("MA22", "Verde Água", "#7FD1B9"),
  v("MA23", "Verde Bandeira", "#0E7B2A"),
  v("MA24", "Verde Floresta", "#1B4332"),
  v("MA25", "Verde Limão", "#9ACD32"),
  v("MA26", "Verde Musgo", "#4A5D23"),
  v("MA27", "Verde Piscina", "#3FA9D6"),
];

// ===== BAGUM (catálogo oficial — 19 cores) =====
const bagumVariants: ProductVariant[] = [
  v("BG01", "Amarelo", "#F5C518"),
  v("BG02", "Azul Baby", "#9EC8E8"),
  v("BG03", "Azul Royal", "#1E40AF"),
  v("BG04", "Bege", "#C9A57A"),
  v("BG05", "Branco", "#F4F4F2"),
  v("BG06", "Chumbo", "#4A4A4A"),
  v("BG07", "Cinza", "#8A8A8A"),
  v("BG08", "Laranja", "#E65100"),
  v("BG09", "Lilás", "#C8A2C8"),
  v("BG10", "Marinho", "#0D1B3D"),
  v("BG11", "Pink", "#E91E63"),
  v("BG12", "Prata", "#BFC3C7"),
  v("BG13", "Preto", "#111111"),
  v("BG14", "Rosa Baby", "#F8C8DC"),
  v("BG15", "Roxo", "#6A1B9A"),
  v("BG16", "Verde Baby", "#B7E4C7"),
  v("BG17", "Verde Bandeira", "#0E7B2A"),
  v("BG18", "Verde Limão", "#9ACD32"),
  v("BG19", "Vermelho", "#C81E1E"),
];

// ===== CORINO (catálogo oficial — 22 cores) =====
const corinoVariants: ProductVariant[] = [
  v("CR01", "Amarelo", "#F5C518"),
  v("CR02", "Areia", "#E4D2A6"),
  v("CR03", "Azul Bebê", "#9EC8E8"),
  v("CR04", "Azul Royal", "#1E40AF"),
  v("CR05", "Bege", "#C9A57A"),
  v("CR06", "Branco", "#F4F4F2"),
  v("CR07", "Cinza", "#8A8A8A"),
  v("CR08", "Creme", "#EFE3CB"),
  v("CR09", "Laranja", "#E65100"),
  v("CR10", "Lilás", "#C8A2C8"),
  v("CR11", "Marinho", "#0D1B3D"),
  v("CR12", "Marrom", "#5D3A1A"),
  v("CR13", "Mostarda", "#D4A017"),
  v("CR14", "Prata", "#BFC3C7"),
  v("CR15", "Preto", "#111111"),
  v("CR16", "Rosa Bebê", "#F8C8DC"),
  v("CR17", "Roxo", "#6A1B9A"),
  v("CR18", "Telha", "#B7410E"),
  v("CR19", "Uva", "#522D5B"),
  v("CR20", "Verde Limão", "#9ACD32"),
  v("CR21", "Vermelho", "#C81E1E"),
  v("CR22", "Vinho", "#5B0E1A"),
];

// ===== NAPA COLORIDA (catálogo oficial — 16 cores) =====
const napaVariants: ProductVariant[] = [
  v("NP01", "Amarelo", "#F5C518"),
  v("NP02", "Azul Bebê", "#9EC8E8"),
  v("NP03", "Marinho", "#0D1B3D"),
  v("NP04", "Royal", "#1E40AF"),
  v("NP05", "Bege", "#C9A57A"),
  v("NP06", "Branco", "#F4F4F2"),
  v("NP07", "Chumbo", "#4A4A4A"),
  v("NP08", "Cinza", "#8A8A8A"),
  v("NP09", "Laranja", "#E65100"),
  v("NP10", "Pink", "#E91E63"),
  v("NP11", "Prata", "#BFC3C7"),
  v("NP12", "Preto", "#111111"),
  v("NP13", "Roxo", "#6A1B9A"),
  v("NP14", "Vermelho", "#C81E1E"),
  v("NP15", "Verde Bandeira", "#0E7B2A"),
  v("NP16", "Verde Limão", "#9ACD32"),
];

// ===== NAPA ESTAMPADA (catálogo oficial) =====
const napaEstampadaVariants: ProductVariant[] = [
  v("NPE01", "Lilás 1", "#C8A2C8"),
  v("NPE02", "Verde 1", "#4A8F3A"),
];

// ===== GRAMA SINTÉTICA 10/12mm — 65.000 pontos (6 cores) =====
const gramaVariants: ProductVariant[] = [
  v("GS01", "Verde", "#2E7D32"),
  v("GS02", "Amarelo", "#F5C518"),
  v("GS03", "Preto", "#111111"),
  v("GS04", "Branco", "#F4F4F2"),
  v("GS05", "Vermelho", "#C81E1E"),
  v("GS06", "Azul Royal", "#1E40AF"),
];

export const products: Product[] = [
  // ============== CAPACHO ==============
  {
    id: "p-capacho",
    slug: "capacho-de-vinil",
    code: capachoVariants[0].code,
    name: "Capacho de Vinil",
    category: "capachos",
    shortDescription: "Capacho de vinil 100% PVC, antiderrapante, disponível em 27 cores.",
    description:
      "Fabricado em PVC 100%, o Capacho de Vinil Márcio Alegre é a solução ideal para áreas de alto tráfego, oferecendo alta resistência, segurança e praticidade. Seu design vazado retém poeira e sujeira, mantendo o ambiente sempre limpo. Disponível em 27 cores para combinar com qualquer ambiente comercial ou residencial.",
    image: capacho,
    sizes: ["1,20m x 12,00m (rolo)", "Sob medida"],
    colors: capachoVariants.map((x) => x.color),
    thickness: "12 mm",
    material: "100% PVC fundido",
    applications: ["Residências", "Comércios", "Escritórios", "Condomínios", "Recepções", "Portarias"],
    width: "1,20m",
    length: "Rolo de 12m ou corte sob medida",
    finish: "Vazado antiderrapante",
    typeOfUse: "Interno e Externo",
    resistance: "Alta resistência ao tráfego intenso, lavável",
    purposes: ["Para Decoração", "Para Comércio", "Para Uso Residencial", "Para Proteção"],
    variants: capachoVariants,
    widthOptions: ["1,20m"],
    saleUnitOptions: ["Metro Linear", "Rolo Fechado"],
    applicationImages: [
      { url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80", caption: "Entrada residencial acolhedora" },
      { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80", caption: "Recepção de escritório" },
      { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80", caption: "Entrada de comércio" },
      { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80", caption: "Varanda decorada" },
    ],
  },

  // ============== BAGUM ==============
  {
    id: "p-bagum",
    slug: "bagum",
    code: bagumVariants[0].code,
    name: "Bagum",
    category: "bagum",
    shortDescription: "Laminado plástico flexível em 19 cores, ideal para confecção e revestimentos.",
    description:
      "O Bagum Márcio Alegre é um laminado de PVC flexível, impermeável e altamente resistente. Excelente para confecção de bolsas, pastas, capas, toalhas de mesa, proteção de superfícies e revestimentos em geral. Disponível em 19 cores vivas.",
    image: bagum,
    sizes: ["1,40m largura", "Rolo 50m", "Metro linear"],
    colors: bagumVariants.map((x) => x.color),
    thickness: "0,6mm",
    material: "Laminado de PVC acoplado a malha de poliéster",
    applications: ["Toalhas de mesa", "Eventos", "Confecção de bolsas e capas", "Proteção de superfícies"],
    width: "1,40m",
    length: "Rolo de 50m ou metro linear",
    finish: "Brilhante impermeável",
    typeOfUse: "Proteção, Revestimento e Confecção",
    resistance: "Impermeável e resistente a rasgos",
    purposes: ["Para Proteção", "Para Eventos", "Para Mesas", "Para Comércio", "Para Uso Residencial"],
    variants: bagumVariants,
    widthOptions: ["1,40m"],
    saleUnitOptions: ["Metro Linear", "Rolo Fechado"],
    applicationImages: [
      { url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=600&q=80", caption: "Mesa de festa com toalha de bagum" },
      { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80", caption: "Evento corporativo" },
      { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80", caption: "Área gourmet" },
      { url: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&w=600&q=80", caption: "Superfície protegida" },
    ],
  },

  // ============== CORINO ==============
  {
    id: "p-corino",
    slug: "corino",
    code: corinoVariants[0].code,
    name: "Corino",
    category: "corino",
    shortDescription: "Corino liso de alta resistência em 22 cores, perfeito para estofados.",
    description:
      "Corino Márcio Alegre — laminado de PVC acoplado a malha de algodão, com toque macio e acabamento uniforme. Ideal para revestimento de sofás, poltronas, cabeceiras, cadeiras e painéis decorativos.",
    image: corino,
    sizes: ["1,40m largura", "Rolo 50m", "Metro linear"],
    colors: corinoVariants.map((x) => x.color),
    thickness: "1,0mm",
    material: "PVC acoplado a malha de algodão",
    applications: ["Sofás", "Poltronas", "Cabeceiras", "Estofados", "Painéis decorativos"],
    width: "1,40m",
    length: "Rolo de 50m ou metro linear",
    finish: "Fosco com textura couro suave",
    typeOfUse: "Estofamento de alta resistência",
    resistance: "Alta resistência a rasgos e tração",
    purposes: ["Para Sofás", "Para Estofados", "Para Decoração", "Para Uso Residencial", "Para Comércio"],
    variants: corinoVariants,
    widthOptions: ["1,40m"],
    saleUnitOptions: ["Metro Linear", "Rolo Fechado"],
    applicationImages: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", caption: "Sofá contemporâneo" },
      { url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80", caption: "Poltrona clássica" },
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80", caption: "Cabeceira estofada" },
      { url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80", caption: "Painel decorativo" },
    ],
  },

  // ============== NAPA COLORIDA ==============
  {
    id: "p-napa",
    slug: "napa",
    code: napaVariants[0].code,
    name: "Napa Colorida",
    category: "napa",
    shortDescription: "Napa premium com textura couro em 16 cores lisas.",
    description:
      "Napa lisa de alta qualidade, com toque macio e textura couro. Ideal para bancos, estofados, revestimentos automotivos e decoração em geral. Resistente ao desgaste e impermeável.",
    image: napa,
    sizes: ["1,40m largura", "Rolo 50m", "Metro linear"],
    colors: napaVariants.map((x) => x.color),
    thickness: "0,8mm",
    material: "PVC laminado com reforço em poliéster",
    applications: ["Bancos", "Estofados", "Revestimentos", "Painéis estofados", "Decoração"],
    width: "1,40m",
    length: "Rolo de 50m ou metro linear",
    finish: "Semibrilho com textura couro",
    typeOfUse: "Estofados e Revestimentos",
    resistance: "Resistência a riscos e impermeável",
    purposes: ["Para Estofados", "Para Sofás", "Para Decoração", "Para Uso Residencial", "Para Comércio"],
    variants: napaVariants,
    widthOptions: ["1,40m"],
    saleUnitOptions: ["Metro Linear", "Rolo Fechado"],
    applicationImages: [
      { url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80", caption: "Poltrona em napa" },
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", caption: "Sofá moderno" },
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80", caption: "Cabeceira estofada" },
      { url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80", caption: "Cadeira comercial" },
    ],
  },

  // ============== NAPA ESTAMPADA ==============
  {
    id: "p-napa-estampada",
    slug: "napa-estampada",
    code: napaEstampadaVariants[0].code,
    name: "Napa Estampada",
    category: "napa",
    shortDescription: "Napa com estampas exclusivas para decoração diferenciada.",
    description:
      "Napa estampada Márcio Alegre — combina a resistência da napa tradicional com estampas exclusivas, perfeita para projetos decorativos diferenciados, cabeceiras, poltronas e painéis.",
    image: napaEstampada,
    sizes: ["1,40m largura", "Rolo 50m", "Metro linear"],
    colors: napaEstampadaVariants.map((x) => x.color),
    thickness: "0,8mm",
    material: "PVC laminado estampado com reforço em poliéster",
    applications: ["Cabeceiras decorativas", "Poltronas", "Painéis", "Decoração"],
    width: "1,40m",
    length: "Rolo de 50m ou metro linear",
    finish: "Estampado fosco",
    typeOfUse: "Decoração e Estofados",
    resistance: "Resistente e impermeável",
    purposes: ["Para Decoração", "Para Estofados", "Para Uso Residencial", "Para Comércio"],
    variants: napaEstampadaVariants,
    widthOptions: ["1,40m"],
    saleUnitOptions: ["Metro Linear", "Rolo Fechado"],
  },

  // ============== GRAMA SINTÉTICA ==============
  {
    id: "p-grama",
    slug: "grama-sintetica-10-12mm",
    code: gramaVariants[0].code,
    name: "Grama Sintética 10/12 mm",
    category: "grama-sintetica",
    shortDescription: "Grama sintética 65.000 pontos, 10/12 mm — 6 cores disponíveis.",
    description:
      "Grama sintética de altíssima densidade (65.000 pontos), altura 10/12 mm. Ideal para decoração, jardins, áreas externas, playgrounds, eventos e ambientação comercial. Bobinas de 2m de largura por 25m ou 10m de comprimento.",
    image: gramaSintetica,
    sizes: ["2,00m x 25,00m (bobina)", "2,00m x 10,00m (bobina)", "Sob medida"],
    colors: gramaVariants.map((x) => x.color),
    thickness: "10/12 mm",
    material: "Polietileno e polipropileno — 65.000 pontos",
    applications: ["Jardins", "Áreas externas", "Playground", "Decoração", "Eventos", "Vitrines"],
    width: "2,00m",
    length: "Bobinas de 10m ou 25m",
    finish: "Fios macios de alta densidade",
    typeOfUse: "Decorativo e Esportivo",
    resistance: "Resistente a UV e tráfego",
    purposes: ["Para Decoração", "Para Eventos", "Para Comércio", "Para Uso Residencial"],
    variants: gramaVariants,
    widthOptions: ["2,00m"],
    saleUnitOptions: ["Bobina 10m", "Bobina 25m", "Sob medida"],
    applicationImages: [
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80", caption: "Jardim residencial" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80", caption: "Área de playground" },
      { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80", caption: "Ambientação de eventos" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80", caption: "Vitrine comercial" },
    ],
  },
];

// ============== HELPERS PARA PRODUTOS ADICIONAIS ==============
const COLOR_HEX: Record<string, string> = {
  "amarelo": "#F5C518", "areia": "#E4D2A6", "azul": "#1E40AF", "azul baby": "#9EC8E8",
  "azul bebê": "#9EC8E8", "azul bebe": "#9EC8E8", "azul ciano": "#00B7EB", "azul claro": "#9EC8E8",
  "azul curaça": "#00A6CB", "azul marinho": "#0D1B3D", "azul royal": "#1E40AF", "azul turquesa": "#1ABC9C",
  "az. royal": "#1E40AF", "az. marinho": "#0D1B3D", "bege": "#C9A57A", "bege claro": "#EFE3CB",
  "bege escuro": "#A1825B", "bordô": "#5B0E1A", "branca": "#F4F4F2", "branco": "#F4F4F2",
  "camelo": "#C19A6B", "caramelo": "#A0522D", "castor": "#8B5A2B", "cereja": "#9B111E",
  "chumbo": "#4A4A4A", "cinza": "#8A8A8A", "creme": "#EFE3CB", "fendi": "#9C8866",
  "ferrari": "#D2241C", "fumê": "#3F3F3F", "grafite": "#3A3A3A", "grená": "#7A1F1F",
  "laranja": "#E65100", "lilás": "#C8A2C8", "limão": "#9ACD32", "marfim": "#F1ECD6",
  "marinho": "#0D1B3D", "marítimo": "#1B4F72", "marrom": "#5D3A1A", "musgo": "#4A5D23",
  "ouro": "#C9A227", "pink": "#E91E63", "prata": "#BFC3C7", "preto": "#111111",
  "rosa": "#E91E8C", "rosa baby": "#F8C8DC", "rosa bebê": "#F8C8DC", "rosa chiclé": "#FF66A3",
  "roxo": "#6A1B9A", "royal": "#1E40AF", "telha": "#B7410E", "turquesa": "#1ABC9C",
  "uva": "#522D5B", "verde": "#2E7D32", "verde baby": "#B7E4C7", "verde band": "#0E7B2A",
  "verde bandeira": "#0E7B2A", "verde clara": "#A8E6A2", "verde claro": "#A8E6A2", "verde escuro": "#0B5D1E",
  "verde limão": "#9ACD32", "verde musgo": "#4A5D23", "verde pistache": "#93C572", "verde bebê": "#B7E4C7",
  "vermelho": "#C81E1E", "vinho": "#5B0E1A", "cinza 915": "#A0A0A0", "cinza 076": "#7A7A7A",
  "cinza 077": "#9A9A9A", "cinza vw": "#888888", "automotivo": "#2A2A2A",
};

const hexFor = (c: string) => COLOR_HEX[c.toLowerCase().trim()] ?? "#999999";
const mkVariants = (prefix: string, colors: string[]): ProductVariant[] =>
  colors.map((c, i) => v(`${prefix}${String(i + 1).padStart(2, "0")}`, c, hexFor(c)));

const IMG = {
  bagunzito: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
  antiderrapante: "https://images.unsplash.com/photo-1583845112239-97ef1341b271?auto=format&fit=crop&w=900&q=80",
  blackout: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  passadeira: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  forracao: "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=900&q=80",
  cristal: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  leitoso: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
  lona: "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6e?auto=format&fit=crop&w=900&q=80",
  tnt: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
  verniz: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
  jacquard: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
  toalhaCristal: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  toalhaRendada: "https://images.unsplash.com/photo-1551218372-a8789b81b253?auto=format&fit=crop&w=900&q=80",
  natalina: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=900&q=80",
  telaPvc: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80",
  juta: "https://images.unsplash.com/photo-1597392582469-a697322d5c16?auto=format&fit=crop&w=900&q=80",
  suede: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80",
  forro: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
  dunas: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
};

function buildAdditionalProducts(): Product[] {
  const bagunzitoColors = ["Amarelo","Azul Baby","Azul Royal","Bege","Branco","Chumbo","Cinza","Laranja","Lilás","Marinho","Pink","Prata","Preto","Rosa Baby","Roxo","Verde Baby","Verde Bandeira","Verde Limão","Vermelho"];
  const antiderColors = ["Preto","Limão","Laranja","Azul","Roxo","Branco","Bege"];
  const blackoutColors = ["Branco","Bege"];
  const passadeiraColors = ["Branco","Vermelho","Grená","Bege","Fumê","Marrom","Musgo","Azul","Cinza 915","Cinza 076","Cinza 077","Cinza VW","Grafite","Automotivo","Preto"];
  const forracaoColors = ["Grafite","Preto","Cinza","Azul Curaça","Castor","Camelo","Bege","Musgo","Vermelho","Cereja","Branco","Roxo","Vinho","Amarelo","Azul Royal","Verde Bandeira","Laranja","Pink","Turquesa"];
  const leitosoColors = ["Amarelo","Azul Royal","Verde Claro","Verde Escuro","Branco","Azul Claro","Vermelho"];
  const lonaColors = ["Amarelo","Areia","Azul Royal","Azul Marinho","Bege","Branco","Caramelo","Cinza","Laranja","Marrom","Preto","Verde","Vermelho"];
  const lonaListraColors = ["Amarelo","Azul Royal","Azul Marinho","Preto","Verde","Vermelho"];
  const tntMetalColors = ["Preto","Verde","Ouro","Prata","Royal","Azul Ciano","Pink","Vermelho"];
  const tnt40Colors = ["Azul Claro","Marinho","Azul Royal","Amarelo","Laranja","Branco","Bege Claro","Bege Escuro","Preto","Verde Bandeira","Marrom","Vermelho","Roxo","Rosa","Pink","Lilás"];
  const tnt80Colors = ["Preto","Branco","Bege Escuro"];
  const vernizColors = ["Azul Turquesa","Azul Bebê","Marinho","Azul Royal","Bege","Branco","Preto","Grafite","Rosa Bebê","Pink","Rosa Chiclé","Lilás","Marfim","Verde Pistache","Verde Bandeira","Verde Bebê","Marrom","Vermelho","Roxo","Amarelo"];

  return [
    { id: "p-bagunzito", slug: "bagunzito", code: "BZ01", name: "Bagunzito", category: "bagunzito",
      shortDescription: "Laminado Bagunzito em 19 cores vivas.",
      description: "Bagunzito Márcio Alegre — laminado plástico em ampla cartela de cores, ideal para confecção, capas e revestimentos leves.",
      image: IMG.bagunzito, sizes: [], colors: bagunzitoColors, applications: [],
      variants: mkVariants("BZ", bagunzitoColors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-antiderrapante", slug: "tela-antiderrapante", code: "AD01", name: "Tela Antiderrapante", category: "antiderrapante",
      shortDescription: "Tela antiderrapante em 7 cores.",
      description: "Tela antiderrapante para forrar gavetas, prateleiras, bandejas e fixar tapetes. Disponível em 7 cores.",
      image: IMG.antiderrapante, sizes: [], colors: antiderColors,
      applications: ["Gavetas", "Prateleiras", "Bandejas", "Fixação de tapetes"],
      variants: mkVariants("AD", antiderColors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-blackout", slug: "blackout-corta-luz", code: "BL01", name: "Blackout Corta-Luz", category: "blackout",
      shortDescription: "Tecido blackout corta-luz nas cores Branco e Bege.",
      description: "Blackout corta-luz Márcio Alegre — tecido que bloqueia a passagem de luz, ideal para cortinas, persianas e ambientes que necessitam de escurecimento total.",
      image: IMG.blackout, sizes: [], colors: blackoutColors,
      applications: ["Cortinas", "Persianas", "Ambientes escurecidos"],
      variants: mkVariants("BL", blackoutColors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-passadeira-1m", slug: "passadeira-1m", code: "PSC01", name: "Passadeira 1M", category: "carpete-forracao",
      shortDescription: "Passadeira de 1m de largura em 15 cores.",
      description: "Passadeira de carpete Márcio Alegre, 1m de largura, ideal para corredores, recepções e áreas de circulação.",
      image: IMG.passadeira, sizes: [], colors: passadeiraColors,
      applications: ["Corredores", "Recepções", "Áreas de circulação"],
      width: "1,00m", variants: mkVariants("PSC", passadeiraColors),
      widthOptions: ["1,00m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-forracao-2m", slug: "forracao-2m", code: "FR01", name: "Forração 2M", category: "carpete-forracao",
      shortDescription: "Forração de 2m de largura em 19 cores.",
      description: "Forração Márcio Alegre 2m de largura, ideal para grandes áreas, eventos, lojas e ambientes corporativos.",
      image: IMG.forracao, sizes: [], colors: forracaoColors,
      applications: ["Eventos", "Lojas", "Ambientes corporativos", "Stands"],
      width: "2,00m", variants: mkVariants("FR", forracaoColors),
      widthOptions: ["2,00m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-dunas", slug: "passadeira-dunas", code: "DU01", name: "Passadeira Dunas 1,30m", category: "carpete-forracao",
      shortDescription: "Passadeira Dunas estampada, 1,30m de largura.",
      description: "Passadeira Dunas Márcio Alegre — 1,30m de largura, com diversas estampas decorativas.",
      image: IMG.dunas, sizes: [], colors: ["Mãozinhas","Cidade","Abecedário","Espaço","Labirinto","Estrada","Letras","Bolas"],
      applications: ["Quartos infantis", "Áreas lúdicas", "Corredores"],
      width: "1,30m",
      variants: [v("DU01","Mãozinhas","#F8C8DC"),v("DU02","Cidade","#8A8A8A"),v("DU03","Abecedário","#F5C518"),v("DU04","Espaço","#0D1B3D"),v("DU05","Labirinto","#1E40AF"),v("DU06","Estrada","#3A3A3A"),v("DU07","Letras","#E91E63"),v("DU08","Bolas","#C81E1E")],
      widthOptions: ["1,30m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-cristal-papel", slug: "cristal-com-papel", code: "CP01", name: "Cristal com Papel", category: "plastico-cristal",
      shortDescription: "Plástico PVC Cristal com Papel em 11 espessuras.",
      description: "Plástico PVC Cristal com Papel — acabamento liso, ideal para proteção e embalagem.",
      image: IMG.cristal, sizes: [], colors: ["Cristal"],
      applications: ["Proteção de superfícies", "Embalagem", "Forros"],
      thicknessOptions: ["0.8","0.9","0,10","0,13","0,15","0,18","0,20","0,27","0,30","0,40","0,60"],
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-cristal-super-clear", slug: "cristal-super-clear", code: "CSC01", name: "Cristal Super Clear", category: "plastico-cristal",
      shortDescription: "Cristal Super Clear de alta transparência em 8 espessuras.",
      description: "Cristal Super Clear Márcio Alegre — PVC cristal de altíssima transparência, ideal para proteção premium de mesas, balcões e cortinas.",
      image: IMG.cristal, sizes: [], colors: ["Super Clear"],
      applications: ["Proteção de mesas", "Balcões", "Cortinas"],
      thicknessOptions: ["0,30","0,40","0,50","0,60","0,80","1,0","1,5","2,0"],
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-leitoso", slug: "plastico-leitoso", code: "LT01", name: "Plástico Leitoso", category: "plastico-leitoso",
      shortDescription: "Plástico Leitoso translúcido em 7 cores.",
      description: "Plástico Leitoso Márcio Alegre — material translúcido colorido, ideal para divisórias, abajures e usos decorativos.",
      image: IMG.leitoso, sizes: [], colors: leitosoColors,
      applications: ["Divisórias", "Abajures", "Decoração"],
      variants: mkVariants("LT", leitosoColors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-betlight", slug: "lona-betlight", code: "LB01", name: "Lona Betlight 1,40M", category: "lonas",
      shortDescription: "Lona Betlight, largura 1,40m, em 13 cores.",
      description: "Lona Betlight Márcio Alegre — leve e versátil, para coberturas e proteção.",
      image: IMG.lona, sizes: [], colors: lonaColors, applications: ["Coberturas", "Proteção"],
      width: "1,40m", variants: mkVariants("LB", lonaColors),
      widthOptions: ["1,40m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-bet320", slug: "lona-bet320", code: "LBT01", name: "Lona Bet320 1,40M", category: "lonas",
      shortDescription: "Lona Bet320 com fundo colorido, 1,40m.",
      description: "Lona Bet320 Márcio Alegre — fundo colorido, 1,40m de largura, 13 cores.",
      image: IMG.lona, sizes: [], colors: lonaColors, applications: ["Coberturas", "Proteção"],
      width: "1,40m", variants: mkVariants("LBT", lonaColors),
      widthOptions: ["1,40m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-betflex", slug: "lona-betflex", code: "LBF01", name: "Lona BetFlex 1,40M / 2,0M", category: "lonas",
      shortDescription: "Lona BetFlex em larguras 1,40m e 2,0m.",
      description: "Lona BetFlex Márcio Alegre — fundo colorido ou gelo, disponível nas larguras 1,40m e 2,00m.",
      image: IMG.lona, sizes: [], colors: lonaColors, applications: ["Coberturas", "Proteção"],
      variants: mkVariants("LBF", lonaColors),
      widthOptions: ["1,40m", "2,00m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-betsuper", slug: "lona-betsuper", code: "LBS01", name: "Lona BetSuper 1,40M / 2,0M", category: "lonas",
      shortDescription: "Lona BetSuper em larguras 1,40m e 2,0m.",
      description: "Lona BetSuper Márcio Alegre — fundo colorido ou gelo, disponível em 1,40m e 2,00m.",
      image: IMG.lona, sizes: [], colors: lonaColors, applications: ["Coberturas", "Proteção"],
      variants: mkVariants("LBS", lonaColors),
      widthOptions: ["1,40m", "2,00m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-s", slug: "lona-s", code: "LS01", name: "Lona S 2,20M / 2,80M", category: "lonas",
      shortDescription: "Lona S em larguras 2,20m e 2,80m.",
      description: "Lona S Márcio Alegre — fundo gelo, larguras 2,20m e 2,80m.",
      image: IMG.lona, sizes: [], colors: lonaColors, applications: ["Coberturas", "Proteção"],
      variants: mkVariants("LS", lonaColors),
      widthOptions: ["2,20m", "2,80m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-betlistras", slug: "lona-betlistras", code: "LL01", name: "Lona BetListras 1,40m", category: "lonas",
      shortDescription: "Lona BetListras com fundo gelo, 1,40m.",
      description: "Lona BetListras Márcio Alegre — padrão listrado, fundo gelo, 1,40m de largura.",
      image: IMG.lona, sizes: [], colors: lonaListraColors, applications: ["Coberturas", "Decoração"],
      width: "1,40m", variants: mkVariants("LL", lonaListraColors),
      widthOptions: ["1,40m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-lona-betlistras2", slug: "lona-betlistras2", code: "LL201", name: "Lona BetListras2 1,40m", category: "lonas",
      shortDescription: "Lona BetListras2 com fundo gelo, 1,40m.",
      description: "Lona BetListras2 Márcio Alegre — variação do padrão listrado, fundo gelo, 1,40m.",
      image: IMG.lona, sizes: [], colors: lonaListraColors, applications: ["Coberturas", "Decoração"],
      width: "1,40m", variants: mkVariants("LL2", lonaListraColors),
      widthOptions: ["1,40m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-tnt-40", slug: "tnt-40gr", code: "TN01", name: "TNT 40gr", category: "tnt",
      shortDescription: "TNT 40gr em 16 cores.",
      description: "TNT 40gr Márcio Alegre — ideal para decoração, festas, embalagens e artesanato.",
      image: IMG.tnt, sizes: [], colors: tnt40Colors, applications: ["Eventos", "Decoração", "Artesanato"],
      variants: mkVariants("TN", tnt40Colors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-tnt-80", slug: "tnt-80gr", code: "TN801", name: "TNT 80gr", category: "tnt",
      shortDescription: "TNT 80gr em 3 cores.",
      description: "TNT 80gr Márcio Alegre — gramatura reforçada para aplicações que exigem maior resistência.",
      image: IMG.tnt, sizes: [], colors: tnt80Colors, applications: ["Eventos", "Decoração", "Embalagem reforçada"],
      variants: mkVariants("TN8", tnt80Colors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-tnt-metalizado", slug: "tnt-metalizado", code: "TNM01", name: "TNT Metalizado", category: "tnt",
      shortDescription: "TNT Metalizado em 8 cores brilhantes.",
      description: "TNT Metalizado Márcio Alegre — efeito metalizado para decoração diferenciada de festas e eventos.",
      image: IMG.tnt, sizes: [], colors: tntMetalColors, applications: ["Festas", "Eventos", "Decoração metalizada"],
      variants: mkVariants("TNM", tntMetalColors), saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-tnt-estampa", slug: "tnt-estampado", code: "TNE01", name: "TNT Estampado", category: "tnt",
      shortDescription: "TNT Estampado em diversos padrões numerados.",
      description: "TNT Estampado Márcio Alegre — padrões numerados (01 ao 40 e edições temáticas), ideais para decoração de festas e eventos.",
      image: IMG.tnt, sizes: [], colors: [], applications: ["Festas", "Eventos", "Decoração"],
      variants: ["01","02","03","04","05","06","08","09","10","11","13","15","16","18","20","21","22","24","27","28","29","31","35","36","37","38","39","40","Happy Birthday"].map((n,i)=>v(`TNE${String(i+1).padStart(2,"0")}`, `Estampa ${n}`, "#999999")),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-verniz", slug: "verniz-040", code: "VN01", name: "Verniz 0,40", category: "verniz",
      shortDescription: "PVC Verniz 0,40mm em 20 cores.",
      description: "Verniz Márcio Alegre 0,40mm — acabamento brilhante envernizado, em ampla cartela de cores.",
      image: IMG.verniz, sizes: [], colors: vernizColors, applications: ["Confecção", "Decoração", "Acabamentos"],
      thickness: "0,40mm", variants: mkVariants("VN", vernizColors),
      thicknessOptions: ["0,40mm"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-jacquard", slug: "toalha-jacquard", code: "JQ01", name: "Toalha Jacquard", category: "toalhas-mesa",
      shortDescription: "Toalha Jacquard em diversos padrões numerados.",
      description: "Toalha Jacquard Márcio Alegre — padrões numerados oficiais, acabamento sofisticado para mesas residenciais e comerciais.",
      image: IMG.jacquard, sizes: [], colors: [], applications: ["Mesas residenciais", "Mesas comerciais", "Eventos"],
      variants: ["8712","8747","8731","8732","8748","8728","8736","8749","8715","8734","8718","8713","8752","8726"].map((c,i)=>v(`JQ${String(i+1).padStart(2,"0")}`, `Padrão ${c}`, "#C9A57A")),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-toalha-cristal-010", slug: "toalha-cristal-010", code: "TC01", name: "Toalha Cristal Estampada 0,10", category: "toalhas-mesa",
      shortDescription: "Toalha Cristal Estampada espessura 0,10mm.",
      description: "Toalha Cristal Estampada Márcio Alegre, espessura 0,10mm, em estampas exclusivas.",
      image: IMG.toalhaCristal, sizes: [], colors: [], applications: ["Mesas", "Proteção decorativa"],
      thickness: "0,10mm",
      variants: ["Ciranda","Crochê","Marguerith","Rosetas","Versalles"].map((c,i)=>v(`TC${String(i+1).padStart(2,"0")}`, c, "#E4D2A6")),
      thicknessOptions: ["0,10mm"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-toalha-cristal-013", slug: "toalha-cristal-013", code: "TCC01", name: "Toalha Cristal Estampada 0,13", category: "toalhas-mesa",
      shortDescription: "Toalha Cristal Estampada espessura 0,13mm.",
      description: "Toalha Cristal Estampada Márcio Alegre, espessura 0,13mm, em ampla cartela de estampas.",
      image: IMG.toalhaCristal, sizes: [], colors: [], applications: ["Mesas", "Proteção decorativa"],
      thickness: "0,13mm",
      variants: ["Antiga","E877","E216","E804","I181","J116","J200","J472","J536","J589","J1837","M033","M61","M98","M99B","M99C","M108","M114","M177","M220","M228","M352","M371","M470","M520","M539","M551","M586-1T","M586-6T","M650","M801-1T","M801-17L","M878","M900","M986"].map((c,i)=>v(`TCC${String(i+1).padStart(2,"0")}`, c, "#E4D2A6")),
      thicknessOptions: ["0,13mm"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-toalha-natalina", slug: "toalha-termica-natalina", code: "TNN01", name: "Toalha Térmica Natalina", category: "toalhas-mesa",
      shortDescription: "Toalha Térmica Natalina em estampas festivas.",
      description: "Toalha Térmica Natalina Márcio Alegre — estampas natalinas exclusivas para a ceia.",
      image: IMG.natalina, sizes: [], colors: [], applications: ["Ceia de Natal", "Decoração festiva"],
      variants: ["355-1","Feliz Natal","186C","360-5"].map((c,i)=>v(`TNN${String(i+1).padStart(2,"0")}`, c, "#C81E1E")),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-toalha-rendada", slug: "toalha-rendada", code: "TR01", name: "Toalha Rendada", category: "toalhas-mesa",
      shortDescription: "Toalha Rendada com mais de 30 modelos.",
      description: "Toalha Rendada Márcio Alegre — mais de 30 modelos, com renda em PVC para decoração de mesas.",
      image: IMG.toalhaRendada, sizes: [], colors: [], applications: ["Mesas decoradas", "Eventos", "Buffets"],
      variants: ["23 ToaCrocColor","25 ToaCrocColor","26 ToaCrocColor","30 ToaCrocColor","31 ToaCrocColor","45 ToaCrocColor","50 ToaCrocColor","52 ToaCrocColor","J140","LH-0408A","LH-0570A","LH-0588A","563V","563U","547U","545U","496U","494U","489U","482U","441U","428V","423V","318U","203U","102U","583U","559U","556U","550U"].map((c,i)=>v(`TR${String(i+1).padStart(2,"0")}`, c, "#F1ECD6")),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-tela-pvc-100", slug: "tela-pvc-100", code: "TP10001", name: "Tela PVC 100 JSerrano", category: "tela-pvc",
      shortDescription: "Tela PVC JSerrano linha 100, 1,35m de largura.",
      description: "Tela PVC JSerrano linha 100 — 1,35m de largura, em diversas referências.",
      image: IMG.telaPvc, sizes: [], colors: [], applications: ["Cadeiras", "Espreguiçadeiras", "Móveis externos"],
      width: "1,35m",
      variants: ["100-01","100-20","100-25","100-34","100-36","100-37","100-50","100-54","100-59","100-72","100-73","100-74","100-77","100-78"].map((c)=>v(c, c, "#8A8A8A")),
      widthOptions: ["1,35m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-tela-pvc-300", slug: "tela-pvc-300", code: "TP30001", name: "Tela PVC 300 JSerrano", category: "tela-pvc",
      shortDescription: "Tela PVC JSerrano linha 300, 1,35m de largura.",
      description: "Tela PVC JSerrano linha 300 — 1,35m de largura, em diversas referências.",
      image: IMG.telaPvc, sizes: [], colors: [], applications: ["Cadeiras", "Espreguiçadeiras", "Móveis externos"],
      width: "1,35m",
      variants: ["300-59","300-72","300-73","300-74","300-75","300-76","300-20","300-25","300-37","300-51","300-54","300-56"].map((c)=>v(c, c, "#8A8A8A")),
      widthOptions: ["1,35m"], saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-juta", slug: "juta", code: "JT01", name: "Juta", category: "juta",
      shortDescription: "Juta aberta, fechada e com fios metalizados.",
      description: "Juta Márcio Alegre — tecido natural disponível nos modelos Aberta, Fechada e com fios Dourados ou Prateados.",
      image: IMG.juta, sizes: [], colors: [], applications: ["Decoração rústica", "Eventos", "Artesanato"],
      variants: [v("JT01","Juta Aberta","#C9A57A"),v("JT02","Juta Fechada","#A1825B"),v("JT03","Juta Fios Dourados","#C9A227"),v("JT04","Juta Fios Prateados","#BFC3C7")],
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-suede-amassado", slug: "suede-amassado", code: "SUA01", name: "Suede Amassado", category: "suede",
      shortDescription: "Suede Amassado em 5 cores.",
      description: "Suede Amassado Márcio Alegre — toque macio com efeito amassado.",
      image: IMG.suede, sizes: [], colors: ["Vermelho","Preto","Bege","Fendi","Bege Escuro"],
      applications: ["Estofados", "Decoração", "Almofadas"],
      variants: ["Vermelho","Preto","Bege","Fendi","Bege Escuro"].map((c,i)=>v(`SUA${String(i+1).padStart(2,"0")}`, c, hexFor(c))),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-suede-liso", slug: "suede-liso", code: "SUL01", name: "Suede Liso", category: "suede",
      shortDescription: "Suede Liso em 3 cores.",
      description: "Suede Liso Márcio Alegre — acabamento liso e macio para estofados e decoração.",
      image: IMG.suede, sizes: [], colors: ["Marrom","Verde Musgo","Bege"],
      applications: ["Estofados", "Decoração", "Almofadas"],
      variants: ["Marrom","Verde Musgo","Bege"].map((c,i)=>v(`SUL${String(i+1).padStart(2,"0")}`, c, hexFor(c))),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-suede-estampado", slug: "suede-estampado", code: "SUE01", name: "Suede Estampado", category: "suede",
      shortDescription: "Suede Estampado em diversos padrões.",
      description: "Suede Estampado Márcio Alegre — padrões exclusivos para decoração diferenciada.",
      image: IMG.suede, sizes: [], colors: [], applications: ["Estofados", "Decoração", "Almofadas"],
      variants: ["Vermelho Riscos","Listras Cinza","Motivos Africanos","Azul Riscos","Listras Roxo","Roxo Molhado","Flores Roxo"].map((c,i)=>v(`SUE${String(i+1).padStart(2,"0")}`, c, "#6A1B9A")),
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-forro-armario", slug: "forro-de-armario", code: "FA01", name: "Forro de Armário", category: "forros",
      shortDescription: "Forro de Armário nas cores Bege e Branco.",
      description: "Forro de Armário Márcio Alegre — protege prateleiras e gavetas.",
      image: IMG.forro, sizes: [], colors: ["Bege","Branco"],
      applications: ["Armários", "Prateleiras", "Gavetas"],
      variants: [v("FA01","Bege","#C9A57A"),v("FA02","Branco","#F4F4F2")],
      saleUnitOptions: ["Metro Linear", "Rolo Fechado"] },
    { id: "p-protetor-geladeira", slug: "protetor-de-geladeira", code: "PG01", name: "Protetor de Geladeira", category: "forros",
      shortDescription: "Protetor de Geladeira em 3 opções.",
      description: "Protetor de Geladeira Márcio Alegre — protege contra arranhões e marcas.",
      image: IMG.forro, sizes: [], colors: ["Bege","Branca","Gel Bege"],
      applications: ["Geladeiras", "Eletrodomésticos"],
      variants: [v("PG01","Bege","#C9A57A"),v("PG02","Branca","#F4F4F2"),v("PG03","Gel Bege","#EFE3CB")],
      saleUnitOptions: ["Unidade"] },
  ];
}


export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProducts(p: Product, limit = 4) {
  return products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, limit);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export { baseColors };

products.push(...buildAdditionalProducts());
