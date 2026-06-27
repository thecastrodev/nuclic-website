document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'http://localhost:3000';
  
  // Elementos do DOM
  const cartIcon = document.getElementById("cartIcon");
  const cartCountSpan = document.getElementById("cartCount");
  const cartModalOverlay = document.getElementById("cartModalOverlay");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cartItemsContainer = document.getElementById("cartItems");
  const modalCartCountSpan = document.getElementById("modalCartCount");
  const cartSubtotalSpan = document.getElementById("cartSubtotal");
  const continueShoppingBtn = document.getElementById("continueShoppingBtn");
  const finalizePurchaseBtn = document.getElementById("finalizePurchaseBtn");
  const produtosList = document.querySelector(".produtos-list");

  // Estado do carrinho (Array de objetos)
  let cart = [];

  // Busca produtos da API
  async function loadProducts() {
      try {
          const res = await fetch(`${API_URL}/products`);
          if (res.ok) {
              const products = await res.json();
              renderProducts(products);
          } else {
              produtosList.innerHTML = '<p>Erro ao carregar produtos.</p>';
          }
      } catch(e) {
          console.error(e);
          produtosList.innerHTML = '<p>Erro de conexão ao carregar produtos.</p>';
      }
  }

  // Renderiza produtos na tela
  function renderProducts(products) {
      produtosList.innerHTML = '';
      if(products.length === 0) {
          produtosList.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
          return;
      }

      products.forEach(p => {
          // Placeholder image logic
          let imgSrc = 'assets/produto_arduino.png';
          if(p.name.toLowerCase().includes('sensor')) imgSrc = 'assets/produto_sensor.png';
          if(p.name.toLowerCase().includes('rob')) imgSrc = 'assets/produto_robotica.png';

          const article = document.createElement('article');
          article.className = 'produto-card';
          article.dataset.name = p.name;
          article.dataset.price = p.price;
          
          article.innerHTML = `
              <div class="produto-image">
                  <img src="${imgSrc}" alt="${p.name}" />
              </div>
              <div class="produto-info">
                  <h3>${p.name}</h3>
                  <p class="produto-price">R$${p.price.toFixed(2).replace('.', ',')}</p>
                  <p style="font-size: 13px; color: #666; margin-bottom: 10px;">${p.description}</p>
                  <select class="produto-variacao">
                      <option value="Padrão">Padrão</option>
                  </select>
                  <div class="quantidade-controle">
                      <button class="btn-quantidade decrease">-</button>
                      <input type="number" value="1" min="1" max="${p.stock_total - p.stock_withdrawn}" class="quantidade-input" />
                      <button class="btn-quantidade increase">+</button>
                  </div>
                  <button class="btn-adicionar-carrinho">Adicionar ao Carrinho</button>
              </div>
          `;
          produtosList.appendChild(article);
      });

      attachProductEvents();
  }

  function attachProductEvents() {
      document.querySelectorAll('.btn-adicionar-carrinho').forEach((button) => {
          button.addEventListener("click", (event) => {
            const productCard = event.target.closest(".produto-card");
            const name = productCard.dataset.name;
            const price = parseFloat(productCard.dataset.price);
            const image = productCard.querySelector(".produto-image img").src;
            const variation = productCard.querySelector(".produto-variacao").value;
            const quantityInput = productCard.querySelector(".quantidade-input");
            const quantity = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.max);

            if(quantity > max) {
                alert(`Estoque insuficiente. Temos apenas ${max} unidades.`);
                return;
            }

            addItemToCart(name, price, image, variation, quantity);
            
            const originalText = button.textContent;
            button.textContent = "Adicionado!";
            button.style.backgroundColor = "#25D366";
            setTimeout(() => {
              button.textContent = originalText;
              button.style.backgroundColor = "";
            }, 1000);
          });
      });

      document.querySelectorAll(".btn-quantidade.increase").forEach((button) => {
        button.addEventListener("click", (event) => {
          const input = event.target.previousElementSibling;
          const max = parseInt(input.max);
          const current = parseInt(input.value);
          if (current < max) {
            input.value = current + 1;
          }
        });
      });
    
      document.querySelectorAll(".btn-quantidade.decrease").forEach((button) => {
        button.addEventListener("click", (event) => {
          const input = event.target.nextElementSibling;
          if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
          }
        });
      });
  }

  // Carrinho functions
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.textContent = totalItems;
    if (modalCartCountSpan) modalCartCountSpan.textContent = totalItems;
  }

  function updateCartSubtotal() {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    cartSubtotalSpan.textContent = \`R$\${subtotal.toFixed(2).replace(".", ",")}\`;
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = ""; 

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="color: var(--color-text-blue); text-align: center;">Seu carrinho está vazio.</p>';
      return;
    }

    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cart-item");
      cartItemDiv.innerHTML = \`
                <div class="cart-item-image">
                    <img src="\${item.image}" alt="\${item.name}" />
                </div>
                <div class="cart-item-details">
                    <h4>\${item.name}</h4>
                    <p>\${item.variation}</p>
                    <p class="item-price">R$\${item.price.toFixed(2).replace(".", ",")}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control-modal">
                        <button class="decrease-modal" data-id="\${item.id}">-</button>
                        <input type="number" value="\${item.quantity}" min="1" class="quantity-input-modal" data-id="\${item.id}" readonly />
                        <button class="increase-modal" data-id="\${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="\${item.id}">Remover</button>
                </div>
            \`;
      cartItemsContainer.appendChild(cartItemDiv);
    });

    document.querySelectorAll(".decrease-modal").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        updateItemQuantity(itemId, -1);
      });
    });

    document.querySelectorAll(".increase-modal").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        updateItemQuantity(itemId, 1);
      });
    });

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        removeItemFromCart(itemId);
      });
    });
  }

  function addItemToCart(name, price, image, variation, quantity) {
    const itemId = \`\${name}-\${variation}\`;
    const existingItem = cart.find((item) => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: itemId, name, price, image, variation, quantity });
    }
    updateCart();
  }

  function updateItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex((item) => item.id === itemId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1); 
      }
      updateCart();
    }
  }

  function removeItemFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    updateCart();
  }

  function updateCart() {
    updateCartCount();
    updateCartSubtotal();
    renderCartItems();
  }

  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      cartModalOverlay.classList.add("active");
      renderCartItems(); 
    });
  }

  closeModalBtn.addEventListener("click", () => {
    cartModalOverlay.classList.remove("active");
  });

  continueShoppingBtn.addEventListener("click", () => {
    cartModalOverlay.classList.remove("active");
  });

  finalizePurchaseBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio. Adicione itens antes de finalizar a compra.");
      return;
    }

    let whatsappMessage = "Olá, gostaria de comprar os seguintes componentes:\\n\\n";
    cart.forEach((item) => {
      whatsappMessage += \`▪ \${item.quantity}x \${item.name} (\${item.variation})\\n\`;
    });

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    whatsappMessage += \`\\n*Total:* R$\${subtotal.toFixed(2).replace(".", ",")}\`;

    const phoneNumber = "5588999999999"; 
    const whatsappUrl = \`https://wa.me/\${phoneNumber}?text=\${encodeURIComponent(whatsappMessage)}\`;
    window.open(whatsappUrl, "_blank"); 
  });

  // Inicialização
  updateCart();
  loadProducts();
});
