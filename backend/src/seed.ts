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
    { img: "https://images.tcdn.com.br/img/img_prod/751846/placa_uno_r3_smd_atmega328p_cabo_usb_arduino_comp_2_20251006104355_103136814286.jpg", name: "Placa UNO R3 SMD ATmega328P + Cabo USB (Arduino Compatível)", price: 37.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/placa_uno_r3_atmega328_cabo_usb_arduino_compativel_1499_2_e8363be92486f37110f267490c0455fd.jpg", name: "Placa UNO R3 ATmega328 + Cabo USB (Arduino Compatível)", price: 62.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/modulo_wifi_esp32_bluetooth_1323_2_26bd08d6327737ef6c2ba4a680d3904b.jpg", name: "Módulo WiFi ESP32 Bluetooth", price: 41.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/modulo_wifi_esp8266_esp_01_1485_2_cf42d0be853a29a3f4de821d5f3026e9.jpg", name: "Módulo WiFi ESP8266 ESP-01", price: 12.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/files/751846/themes/238/img/empty.png?b24a285e8e5785ee1520ef8550c888df", name: "Sensor de Luminosidade LDR 5mm", price: 0.50, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/receptor_infravermelho_vs1838b_1403_2_20240418033859.jpg", name: "Receptor Infravermelho VS1838B", price: 1.70, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/modulo_multiplexador_cd74hc4067_16_canais_2873_2_379378ab33e586aa04c460cca213eeeb.jpg", name: "Módulo Multiplexador CD74HC4067 - 16 Canais", price: 6.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/fonte_ajustavel_lm2596_step_down_1431_2_20240418035546.jpg", name: "Módulo Regulador de Tensão Ajustável LM2596 Step Down - Entrada 3,2V a 40V para Saída 1,5V a 35V", price: 8.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/micro_servo_9g_sg90_1563_2_fc0f15fed3a477d7f8b91a7244164c26.jpg", name: "Micro Servo 9g SG90", price: 12.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/motor_dc_3_6v_com_caixa_de_reducao_e_eixo_duplo_1551_2_f1ef2bb3bf379e0d2037754735d919a8_20240418040203.jpg", name: "Motor DC 3-6V com Caixa de Redução e Eixo Duplo", price: 7.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/files/751846/themes/238/img/empty.png?b24a285e8e5785ee1520ef8550c888df", name: "LED Difuso 5mm - Vermelho", price: 0.20, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/files/751846/themes/238/img/empty.png?b24a285e8e5785ee1520ef8550c888df", name: "Diodo Retificador 1N4007", price: 0.20, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/terminal_para_conector_kk_5037_2_e9a926f3e5742dd32d4299c46a53b7b7_20240418040040.jpg", name: "Terminal para Conector KK", price: 0.30, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/push_button_1347_2_20240418034513.jpg", name: "Push Button 6x6x5mm - 4 Terminais", price: 0.20, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/files/751846/themes/238/img/empty.png?b24a285e8e5785ee1520ef8550c888df", name: "Camisinha para Sugador de Solda", price: 1.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/alicate_de_corte_de_rente_plato_170_3203_2_b8e5ab4df9084d95cd428fcda98f956c_20240418035249.jpg", name: "Alicate de Corte Rente Plato 170", price: 14.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/filamento_pla_speed_premium_branco_1kg_1_75mm_3dlab_2315_2_aeb9bad2c877f074cf65461a7408a43e.jpg", name: "Filamento PLA Speed Premium Branco 1Kg 1,75mm - 3DLab", price: 139.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" },
    { img: "https://images.tcdn.com.br/img/img_prod/751846/filamento_pla_speed_premium_preto_1kg_1_75mm_3dlab_2313_2_726ce576a123f869eec9f0bec22297f3.jpg", name: "Filamento PLA Speed Premium Preto 1Kg 1,75mm - 3DLab", price: 139.90, stock_total: 100, stock_withdrawn: 0, description: "Componente" }
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
