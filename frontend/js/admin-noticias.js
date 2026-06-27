document.addEventListener('DOMContentLoaded', () => {
    loadNews();

    const modal = document.getElementById('newsModal');
    const closeBtn = document.getElementById('closeNewsModal');
    const cancelBtn = document.getElementById('cancelNewsBtn');
    const newBtn = document.getElementById('btnNewNews');
    const form = document.getElementById('newsForm');

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
        document.getElementById('newsId').value = '';
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    newBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Nova Notícia';
        document.getElementById('newsId').value = '';
        form.reset();
        document.getElementById('newsDate').valueAsDate = new Date();
        modal.classList.add('active');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('newsId').value;
        const payload = {
            title: document.getElementById('newsTitle').value,
            content: document.getElementById('newsContent').value,
            author: document.getElementById('newsAuthor').value,
            published_at: document.getElementById('newsDate').value
        };

        try {
            let res;
            if (id) {
                res = await fetchWithAuth(`/news/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetchWithAuth('/news', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }

            if (res && res.ok) {
                closeModal();
                loadNews();
            } else {
                alert("Erro ao salvar notícia");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão");
        }
    });
});

async function loadNews() {
    const tbody = document.getElementById('newsTableBody');
    try {
        const res = await fetchWithAuth('/news');
        if (!res) return;
        
        const news = await res.json();
        tbody.innerHTML = '';

        if (news.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Nenhuma notícia encontrada.</td></tr>';
            return;
        }

        news.forEach(n => {
            const date = new Date(n.published_at).toLocaleDateString('pt-BR');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${n.title}</td>
                <td>${n.author}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-edit" onclick="editNews('${n.id}')">Editar</button>
                    <button class="btn-danger" onclick="deleteNews('${n.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Erro ao carregar notícias.</td></tr>';
    }
}

window.editNews = async (id) => {
    try {
        const res = await fetchWithAuth(`/news/${id}`);
        if (res && res.ok) {
            const n = await res.json();
            document.getElementById('newsId').value = n.id;
            document.getElementById('newsTitle').value = n.title;
            document.getElementById('newsContent').value = n.content;
            document.getElementById('newsAuthor').value = n.author;
            document.getElementById('newsDate').value = n.published_at ? n.published_at.split('T')[0] : '';
            
            document.getElementById('modalTitle').textContent = 'Editar Notícia';
            document.getElementById('newsModal').classList.add('active');
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados da notícia");
    }
}

window.deleteNews = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
        try {
            const res = await fetchWithAuth(`/news/${id}`, { method: 'DELETE' });
            if (res && res.ok) {
                loadNews();
            } else {
                alert("Erro ao excluir notícia");
            }
        } catch(error) {
            console.error(error);
            alert("Erro de conexão");
        }
    }
}
