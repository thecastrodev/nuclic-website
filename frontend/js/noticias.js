document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';
    const timelineContainer = document.querySelector('.timeline-container');
    const drawerOverlay = document.getElementById('newsDrawerOverlay');
    const closeBtn = document.getElementById('drawerCloseBtn');
    const drawerImage = document.getElementById('drawerImage');
    const drawerDate = document.getElementById('drawerDate');
    const drawerTitle = document.getElementById('drawerTitle');
    const drawerContent = document.getElementById('drawerContent');

    let allNews = [];

    async function fetchNews() {
        try {
            const res = await fetch(`${API_URL}/news`);
            if (res.ok) {
                allNews = await res.json();
                allNews.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
                renderNews(allNews);
            } else {
                timelineContainer.innerHTML = '<p>Erro ao carregar notícias.</p>';
            }
        } catch (e) {
            console.error(e);
            timelineContainer.innerHTML = '<p>Erro de conexão ao carregar notícias.</p>';
        }
    }

    function getMonthName(date) {
        const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return \`\${months[date.getMonth()]} \${date.getFullYear()}\`;
    }

    function renderNews(newsArray) {
        timelineContainer.innerHTML = '';
        if (newsArray.length === 0) {
            timelineContainer.innerHTML = '<p>Nenhuma notícia disponível no momento.</p>';
            return;
        }

        const grouped = {};
        newsArray.forEach(n => {
            const d = new Date(n.published_at);
            const monthYear = getMonthName(d);
            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(n);
        });

        let i = 1;
        for (const monthYear in grouped) {
            const section = document.createElement('section');
            section.className = 'timeline-month-block';
            
            const h2 = document.createElement('h2');
            h2.className = 'timeline-month-title';
            h2.textContent = monthYear;
            section.appendChild(h2);

            const divContent = document.createElement('div');
            divContent.className = 'timeline-content';

            grouped[monthYear].forEach(n => {
                // Determine a placeholder image sequentially
                const imgId = ((i - 1) % 5) + 1;
                const imgSrc = \`assets/news_cover_\${imgId}.png\`;
                i++;

                const article = document.createElement('article');
                article.className = 'news-card';
                article.innerHTML = \`
                    <img class="news-image" src="\${imgSrc}" alt="\${n.title}">
                    <div class="news-details">
                        <h3 class="news-title">\${n.title}</h3>
                        <p class="news-excerpt">\${n.content.substring(0, 150)}...</p>
                        <button class="news-read-more-btn" data-news-id="\${n.id}">Ver Mais</button>
                    </div>
                \`;
                divContent.appendChild(article);
            });

            section.appendChild(divContent);
            timelineContainer.appendChild(section);
        }

        attachEvents();
    }

    function openDrawer(event) {
        const btn = event.currentTarget;
        const newsId = btn.getAttribute('data-news-id');
        const card = btn.closest('.news-card');
        const monthBlock = card.closest('.timeline-month-block');
        
        const imageSrc = card.querySelector('.news-image').src;
        const titleText = card.querySelector('.news-title').innerText;
        const monthText = monthBlock.querySelector('.timeline-month-title').innerText;
        
        const n = allNews.find(item => item.id === newsId);

        drawerImage.src = imageSrc;
        drawerImage.alt = titleText;
        drawerDate.innerText = monthText;
        drawerTitle.innerText = titleText;
        drawerContent.innerHTML = n ? \`<p>\${n.content}</p><p><small>Autor: \${n.author}</small></p>\` : '<p>Conteúdo não encontrado.</p>';

        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeDrawer() {
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    function attachEvents() {
        document.querySelectorAll('.news-read-more-btn').forEach(btn => {
            btn.addEventListener('click', openDrawer);
        });
    }

    if(closeBtn) closeBtn.addEventListener('click', closeDrawer);

    if(drawerOverlay) {
        drawerOverlay.addEventListener('click', (event) => {
            if (event.target === drawerOverlay) closeDrawer();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && drawerOverlay && drawerOverlay.classList.contains('active')) {
            closeDrawer();
        }
    });

    fetchNews();
});
