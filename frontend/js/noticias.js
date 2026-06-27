document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const readMoreButtons = document.querySelectorAll('.news-read-more-btn');
    const drawerOverlay = document.getElementById('newsDrawerOverlay');
    const closeBtn = document.getElementById('drawerCloseBtn');
    
    // Referências para preenchimento de conteúdo na gaveta
    const drawerImage = document.getElementById('drawerImage');
    const drawerDate = document.getElementById('drawerDate');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerContent = document.getElementById('drawerContent');

    // Banco de dados simulado com o conteúdo completo das notícias
    const newsData = {
        '1': `
            <p>A Nuclic (Laboratório de Sistemas de Computação) inaugurou nesta terça-feira seu novíssimo espaço focado inteiramente em projetos de <strong>Internet das Coisas (IoT)</strong>.</p>
            <p>O ambiente foi desenhado do zero para incentivar a colaboração entre estudantes de engenharia e ciência da computação. As novas bancadas já vêm equipadas com braços articulados, osciloscópios de precisão e uma gama enorme de microcontroladores de última geração, incluindo Raspberry Pi 5 e centenas de kits Arduino UNO e Mega.</p>
            <p>Segundo os coordenadores do laboratório, a expectativa é que o número de projetos integradores dobre até o final do semestre, conectando o laboratório a soluções práticas para a comunidade universitária da UFC - Campus Sobral.</p>
        `,
        '2': `
            <p>É com muito orgulho que anunciamos que a equipe de robótica da Nuclic conquistou o primeiro lugar no Campeonato Universitário de Robôs Autônomos (CURA 2026), etapa regional.</p>
            <p>Os estudantes passaram as últimas três semanas madrugando no laboratório, ajustando algoritmos de PID e soldando pontes H para garantir que o robô seguidor de linha e o robô de combate tivessem a máxima eficiência.</p>
            <p>"Foi suado, mas ver o nosso carrinho fazendo o percurso em tempo recorde sem sair da linha preta fez tudo valer a pena", comentou um dos alunos líderes do projeto. A vitória garante a equipe na fase nacional que ocorrerá em novembro.</p>
        `,
        '3': `
            <p>O conceito de Smart Cities (Cidades Inteligentes) não é mais ficção científica, e o laboratório Nuclic quer colocar Sobral no mapa dessa tecnologia.</p>
            <p>Durante a primeira reunião de planejamento do projeto "Smart City Sobral", os alunos e professores desenharam no quadro branco os fluxos de dados necessários para implementar lixeiras inteligentes que avisam quando estão cheias, postes de luz que regulam a intensidade conforme o movimento de pedestres, e um sistema de monitoramento de qualidade do ar de baixo custo.</p>
            <p>O projeto está em fase de captação de voluntários e promete usar muita rede LoRaWAN e sensores espalhados pelo campus da UFC para os primeiros testes de campo já no mês que vem.</p>
        `,
        '4': `
            <p>Aprender programação pode parecer intimidador, mas o primeiro workshop prático de Python organizado pela Nuclic provou o contrário!</p>
            <p>Com mais de 50 inscritos logo no primeiro dia de divulgação, o laboratório ficou lotado de mentes curiosas. Durante 4 horas intensas, os participantes foram desde o "Hello World" até a criação de um script de automação para ler dados de um sensor de temperatura via porta serial.</p>
            <p>A resposta foi tão positiva que já estamos organizando a segunda edição, focada especificamente em tratamento de dados para Machine Learning aplicado à Internet das Coisas.</p>
        `,
        '5': `
            <p>O cheiro de filamento de PLA derretido agora faz parte da rotina da Nuclic. Recebemos e já colocamos em funcionamento a nossa novíssima impressora 3D de alta precisão!</p>
            <p>Esse equipamento é um divisor de águas para os projetos do laboratório. Antes, precisávamos adaptar caixas plásticas de terceiros ou usar materiais improvisados para proteger os circuitos. Agora, nossos alunos projetam os cases personalizados em softwares CAD e materializam as peças em questão de horas.</p>
            <p>A impressora já está rodando a todo vapor produzindo os primeiros suportes articulados para as câmeras dos robôs autônomos.</p>
        `
    };

    // Função para abrir a gaveta
    function openDrawer(event) {
        const btn = event.currentTarget;
        const newsId = btn.getAttribute('data-news-id');
        
        // Encontrar os elementos do card correspondente
        const card = btn.closest('.news-card');
        const monthBlock = card.closest('.timeline-month-block');
        
        const imageSrc = card.querySelector('.news-image').src;
        const titleText = card.querySelector('.news-title').innerText;
        const monthText = monthBlock.querySelector('.timeline-month-title').innerText;
        
        // Preencher a gaveta com os dados da notícia
        drawerImage.src = imageSrc;
        drawerImage.alt = titleText;
        drawerDate.innerText = monthText;
        drawerTitle.innerText = titleText;
        drawerContent.innerHTML = newsData[newsId] || '<p>Conteúdo não encontrado.</p>';

        // Abrir a gaveta adicionando a classe active
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll da página por baixo
    }

    // Função para fechar a gaveta
    function closeDrawer() {
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll da página
    }

    // Atribuir os eventos de clique aos botões "Ver Mais"
    readMoreButtons.forEach(btn => {
        btn.addEventListener('click', openDrawer);
    });

    // Fechar pelo botão X
    closeBtn.addEventListener('click', closeDrawer);

    // Fechar ao clicar fora da gaveta (no overlay escuro)
    drawerOverlay.addEventListener('click', (event) => {
        if (event.target === drawerOverlay) {
            closeDrawer();
        }
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && drawerOverlay.classList.contains('active')) {
            closeDrawer();
        }
    });
});
