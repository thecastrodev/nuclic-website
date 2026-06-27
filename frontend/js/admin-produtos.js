document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('closeProductModal');
    const cancelBtn = document.getElementById('cancelProductBtn');
    const newBtn = document.getElementById('btnNewProduct');
    const form = document.getElementById('productForm');

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
        document.getElementById('productId').value = '';
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    newBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Novo Produto';
        document.getElementById('productId').value = '';
        form.reset();
        modal.classList.add('active');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('productId').value;
        const payload = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock_total: parseInt(document.getElementById('productStock').value),
            stock_withdrawn: 0 // Default
        };

        try {
            let res;
            if (id) {
                // Update
                res = await fetchWithAuth(`/products/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                res = await fetchWithAuth('/products', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }

            if (res && res.ok) {
                closeModal();
                loadProducts();
            } else {
                alert("Erro ao salvar produto");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão");
        }
    });
});

async function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    try {
        const res = await fetchWithAuth('/products');
        if (!res) return;
        
        const products = await res.json();
        tbody.innerHTML = '';

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Nenhum produto encontrado.</td></tr>';
            return;
        }

        products.forEach(p => {
            const tr = document.createElement('tr');
            const currentStock = p.stock_total - p.stock_withdrawn;
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>R$ ${p.price.toFixed(2).replace('.', ',')}</td>
                <td>${currentStock}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${p.id}')">Editar</button>
                    <button class="btn-danger" onclick="deleteProduct('${p.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Erro ao carregar produtos.</td></tr>';
    }
}

window.editProduct = async (id) => {
    try {
        const res = await fetchWithAuth(`/products/${id}`);
        if (res && res.ok) {
            const product = await res.json();
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock_total;
            
            document.getElementById('modalTitle').textContent = 'Editar Produto';
            document.getElementById('productModal').classList.add('active');
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados do produto");
    }
}

window.deleteProduct = async (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const res = await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
            if (res && res.ok) {
                loadProducts();
            } else {
                alert("Erro ao excluir produto");
            }
        } catch(error) {
            console.error(error);
            alert("Erro de conexão");
        }
    }
}
