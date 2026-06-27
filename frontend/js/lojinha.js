document.addEventListener("DOMContentLoaded", () => {
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
  const addProductButtons = document.querySelectorAll(
    ".btn-adicionar-carrinho"
  );
  const quantityIncreaseButtons = document.querySelectorAll(
    ".btn-quantidade.increase"
  );
  const quantityDecreaseButtons = document.querySelectorAll(
    ".btn-quantidade.decrease"
  );

  // Estado do carrinho (Array de objetos)
  let cart = [];

  // Função para atualizar o contador do carrinho no ícone
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.textContent = totalItems;
    if (modalCartCountSpan) modalCartCountSpan.textContent = totalItems;
  }

  // Função para atualizar o subtotal do carrinho
  function updateCartSubtotal() {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    cartSubtotalSpan.textContent = `R$${subtotal.toFixed(2).replace(".", ",")}`;
  }

  // Função para renderizar os itens no modal do carrinho
  function renderCartItems() {
    cartItemsContainer.innerHTML = ""; // Limpa os itens existentes

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p style="color: var(--color-text-blue); text-align: center;">Seu carrinho está vazio.</p>';
      return;
    }

    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cart-item");
      cartItemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.variation}</p>
                    <p class="item-price">R$${item.price
                      .toFixed(2)
                      .replace(".", ",")}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control-modal">
                        <button class="decrease-modal" data-id="${
                          item.id
                        }">-</button>
                        <input type="number" value="${
                          item.quantity
                        }" min="1" class="quantity-input-modal" data-id="${
        item.id
      }" readonly />
                        <button class="increase-modal" data-id="${
                          item.id
                        }">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${
                      item.id
                    }">Remover</button>
                </div>
            `;
      cartItemsContainer.appendChild(cartItemDiv);
    });

    // Adiciona event listeners para os botões de controle de quantidade e remover no modal
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

  // Função para adicionar um item ao carrinho
  function addItemToCart(name, price, image, variation, quantity) {
    // Cria um ID único para o item no carrinho (nome + variação)
    const itemId = `${name}-${variation}`;
    const existingItem = cart.find((item) => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: itemId, name, price, image, variation, quantity });
    }
    updateCart();
  }

  // Função para atualizar a quantidade de um item no carrinho
  function updateItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex((item) => item.id === itemId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1); // Remove o item se a quantidade for 0 ou menos
      }
      updateCart();
    }
  }

  // Função para remover um item do carrinho
  function removeItemFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    updateCart();
  }

  // Função para atualizar o carrinho (contagem, subtotal e renderização)
  function updateCart() {
    updateCartCount();
    updateCartSubtotal();
    renderCartItems();
  }

  // Event listener para abrir o modal do carrinho
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      cartModalOverlay.classList.add("active");
      renderCartItems(); // Garante que os itens são renderizados ao abrir
    });
  }

  // Event listener para fechar o modal do carrinho
  closeModalBtn.addEventListener("click", () => {
    cartModalOverlay.classList.remove("active");
  });

  // Event listener para o botão "Continuar comprando" no modal
  continueShoppingBtn.addEventListener("click", () => {
    cartModalOverlay.classList.remove("active");
  });

  // Event listener para o botão "Finalizar compra" no modal
  finalizePurchaseBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio. Adicione itens antes de finalizar a compra.");
      return;
    }

    let whatsappMessage =
      "Olá, gostaria de comprar os seguintes componentes:\n\n";
    cart.forEach((item) => {
      whatsappMessage += `▪ ${item.quantity}x ${item.name} (${item.variation})\n`;
    });

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    whatsappMessage += `\n*Total:* R$${subtotal.toFixed(2).replace(".", ",")}`;

    // Número de telefone da loja
    const phoneNumber = "5588999999999"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank"); // Abre o WhatsApp em uma nova aba
  });

  // Event listeners para os botões de adicionar ao carrinho
  addProductButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".produto-card");
      const name = productCard.dataset.name;
      const price = parseFloat(productCard.dataset.price);
      const image = productCard.querySelector(".produto-image img").src;
      const variation = productCard.querySelector(".produto-variacao").value;
      const quantity = parseInt(
        productCard.querySelector(".quantidade-input").value
      );

      addItemToCart(name, price, image, variation, quantity);
      
      // Feedback visual simples no botão
      const originalText = button.textContent;
      button.textContent = "Adicionado!";
      button.style.backgroundColor = "#25D366";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "";
      }, 1000);
    });
  });

  // Event listeners para os botões de controle de quantidade na página de produtos
  quantityIncreaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const input = event.target.previousElementSibling;
      input.value = parseInt(input.value) + 1;
    });
  });

  quantityDecreaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const input = event.target.nextElementSibling;
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
      }
    });
  });

  // Inicializa a contagem e subtotal do carrinho ao carregar a página
  updateCart();
});
