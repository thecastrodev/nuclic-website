import { CreateProduct } from "./domain/product/use-cases/create-product.js";
import { CreateNews } from "./domain/news/use-cases/create-news.js";

export async function seedData(createProduct: CreateProduct, createNews: CreateNews) {
  const newsItems = [
    {
      title: "Novo Laboratório de IoT Inaugurado",
      author: "Admin",
      published_at: new Date("2026-06-02T10:00:00Z"),
      content: `
    <p>A Nuclic (Laboratório de Sistemas de Computação) inaugurou nesta terça-feira seu novíssimo espaço focado inteiramente em projetos de <strong>Internet das Coisas (IoT)</strong>.</p>
    <p>O ambiente foi desenhado do zero para incentivar a colaboração entre estudantes de engenharia e ciência da computação. As novas bancadas já vêm equipadas com braços articulados, osciloscópios de precisão e uma gama enorme de microcontroladores de última geração, incluindo Raspberry Pi 5 e centenas de kits Arduino UNO e Mega.</p>
    <p>Segundo os coordenadores do laboratório, a expectativa é que o número de projetos integradores dobre até o final do semestre, conectando o laboratório a soluções práticas para a comunidade universitária da UFC - Campus Sobral.</p>
`
    },
    {
      title: "Alunos do Projeto de Robótica são Premiados",
      author: "Admin",
      published_at: new Date("2026-05-15T14:30:00Z"),
      content: `
    <p>É com muito orgulho que anunciamos que a equipe de robótica da Nuclic conquistou o primeiro lugar no Campeonato Universitário de Robôs Autônomos (CURA 2026), etapa regional.</p>
    <p>Os estudantes passaram as últimas três semanas madrugando no laboratório, ajustando algoritmos de PID e soldando pontes H para garantir que o robô seguidor de linha e o robô de combate tivessem a máxima eficiência.</p>
    <p>"Foi suado, mas ver o nosso carrinho fazendo o percurso em tempo recorde sem sair da linha preta fez tudo valer a pena", comentou um dos alunos líderes do projeto. A vitória garante a equipe na fase nacional que ocorrerá em novembro.</p>
`
    },
    {
      title: "Início do Projeto Smart City Sobral",
      author: "Admin",
      published_at: new Date("2026-05-02T09:00:00Z"),
      content: `
    <p>O conceito de Smart Cities (Cidades Inteligentes) não é mais ficção científica, e o laboratório Nuclic quer colocar Sobral no mapa dessa tecnologia.</p>
    <p>Durante a primeira reunião de planejamento do projeto "Smart City Sobral", os alunos e professores desenharam no quadro branco os fluxos de dados necessários para implementar lixeiras inteligentes que avisam quando estão cheias, postes de luz que regulam a intensidade conforme o movimento de pedestres, e um sistema de monitoramento de qualidade do ar de baixo custo.</p>
    <p>O projeto está em fase de captação de voluntários e promete usar muita rede LoRaWAN e sensores espalhados pelo campus da UFC para os primeiros testes de campo já no mês que vem.</p>
`
    },
    {
      title: "Workshop de Python para Iniciantes",
      author: "Admin",
      published_at: new Date("2026-04-20T16:00:00Z"),
      content: `
    <p>Aprender programação pode parecer intimidador, mas o primeiro workshop prático de Python organizado pela Nuclic provou o contrário!</p>
    <p>Com mais de 50 inscritos logo no primeiro dia de divulgação, o laboratório ficou lotado de mentes curiosas. Durante 4 horas intensas, os participantes foram desde o "Hello World" até a criação de um script de automação para ler dados de um sensor de temperatura via porta serial.</p>
    <p>A resposta foi tão positiva que já estamos organizando a segunda edição, focada especificamente em tratamento de dados para Machine Learning aplicado à Internet das Coisas.</p>
`
    },
    {
      title: "Nova Impressora 3D chega ao Laboratório",
      author: "Admin",
      published_at: new Date("2026-04-05T11:00:00Z"),
      content: `
    <p>O cheiro de filamento de PLA derretido agora faz parte da rotina da Nuclic. Recebemos e já colocamos em funcionamento a nossa novíssima impressora 3D de alta precisão!</p>
    <p>Esse equipamento é um divisor de águas para os projetos do laboratório. Antes, precisávamos adaptar caixas plásticas de terceiros ou usar materiais improvisados para proteger os circuitos. Agora, nossos alunos projetam os cases personalizados em softwares CAD e materializam as peças em questão de horas.</p>
    <p>A impressora já está rodando a todo vapor produzindo os primeiros suportes articulados para as câmeras dos robôs autônomos.</p>
`
    }
  ];

  const productItems = [
    { name: "Chave Gangorra KCD1-101 2 Terminais Verde", price: 1.00, stock_total: 100, stock_withdrawn: 0, description: "Componente eletrônico" },
    { name: "Conector IDC Header Macho 6 Vias 180 Graus", price: 1.20, stock_total: 150, stock_withdrawn: 0, description: "Componente eletrônico" },
    { name: "Resina Rápida Curável UV Creality Azul - 1Kg", price: 269.90, stock_total: 10, stock_withdrawn: 0, description: "Insumo 3D" },
    { name: "Diodo Zener 1N5222 2V5 0.5W", price: 0.20, stock_total: 500, stock_withdrawn: 0, description: "Componente eletrônico" },
    { name: "Pulseira Anti-Estática com Garra Jacaré", price: 17.90, stock_total: 20, stock_withdrawn: 0, description: "Equipamento de segurança" },
    { name: "Kit Expansão GPS para Smart Car 4WD - ACEBOTT", price: 289.90, stock_total: 5, stock_withdrawn: 0, description: "Kit Robótica" },
    { name: "Chave Push Button PBS-110 NA - Preto", price: 2.90, stock_total: 80, stock_withdrawn: 0, description: "Componente eletrônico" },
    { name: "Abraçadeira De Nylon 140x2,5mm Preta 100 Unidades", price: 4.90, stock_total: 30, stock_withdrawn: 0, description: "Acessório" },
    { name: "Conector IDC Header Macho 18 Vias 180 Graus", price: 2.00, stock_total: 100, stock_withdrawn: 0, description: "Componente eletrônico" },
    { name: "Alicate de Inserção Punch Down HK-307 - Hikari", price: 34.90, stock_total: 15, stock_withdrawn: 0, description: "Ferramenta" },
    { name: "Sensor de Efeito Hall 41F", price: 2.90, stock_total: 50, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor Infravermelho TCRT5000", price: 5.90, stock_total: 40, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor de Temperatura e Umidade de Alta Precisão GY-213V HTU21D", price: 19.90, stock_total: 25, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Umidade e Temperatura I2C SHT45 Alta Precisão IP65", price: 199.90, stock_total: 8, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor Reflexivo Infravermelho de Distância Ajustável E3F-DS30P2", price: 45.90, stock_total: 12, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Presença PIR MH-SR602", price: 7.90, stock_total: 60, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Pressão G1/4 1,0 MPa 5V", price: 189.90, stock_total: 5, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Pressão G1/4 0,8 MPa 5V", price: 189.90, stock_total: 5, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Pressão G1/4 0,2 MPa 5V", price: 189.90, stock_total: 5, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Pressão G1/4 0,5 MPa 5V", price: 189.90, stock_total: 5, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor de Luminosidade LDR - KY-018", price: 3.90, stock_total: 70, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Inclinação Magic Light Cup KY-027", price: 4.90, stock_total: 30, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor de Chamas KY-026", price: 4.90, stock_total: 35, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor Strain Gauge BF350 3AA", price: 42.90, stock_total: 10, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Presença PIR HC-SR505", price: 7.90, stock_total: 45, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor de Temperatura Digital DS18B20 com Jumpers", price: 10.90, stock_total: 30, stock_withdrawn: 0, description: "Sensor" },
    { name: "Módulo Sensor de Pressão Negativa XGZP6847A100KPGN", price: 89.90, stock_total: 8, stock_withdrawn: 0, description: "Sensor" },
    { name: "Sensor de Distância Laser com Saída PWM VL53L0X GY-53", price: 79.90, stock_total: 12, stock_withdrawn: 0, description: "Sensor" },
    { name: "Medidor de Energia Inteligente Tuya WiFi 16A", price: 249.90, stock_total: 6, stock_withdrawn: 0, description: "Smart Home" }
  ];

  for (const n of newsItems) {
    const res = await createNews.execute(n);
    if (res.isFailure) console.error("Failed to seed news:", res.error);
  }

  for (const p of productItems) {
    const res = await createProduct.execute(p);
    if (res.isFailure) console.error("Failed to seed product:", p.name, res.error);
  }
  
  console.log("Database seeded successfully.");
}
