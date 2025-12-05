// Arquivo: ../js/interaction.js

// O preço de aluguel é R$ 7,90, como especificado no HTML
const RENTAL_PRICE = 7.9;
let cart = [];

// Elementos DOM
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const paymentModal = document.getElementById('payment-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessageElement = document.getElementById('confirmation-message');


function notify(text) {
  const n = document.getElementById("notify");
  n.textContent = text;
  n.style.top = "20px";

  setTimeout(() => {
    n.style.top = "-60px";
  }, 2500);
}



// --- Funções da Barra Lateral do Carrinho ---

/** Abre/fecha a barra lateral do carrinho. */
function toggleCartSidebar() {
  cartSidebar.classList.toggle('open');
}

/** Atualiza a exibição do carrinho. */
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Nenhum filme no carrinho.</p>';
  } else {
    cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');

      itemElement.innerHTML = `
        <div class="item-info">
          <p><strong>${item.name}</strong></p>
          <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p> 
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Remover</button>
      `;

      cartItemsContainer.appendChild(itemElement);
      total += item.price;
    });
  }

  // Atualiza o total e a contagem
  cartTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  cartCountElement.textContent = cart.length;
}

/** Adiciona um filme ao carrinho. */
function addToCart(movieName) {
  // Verifica se o filme já está no carrinho
  const isDuplicate = cart.some(item => item.id === movieName.toLowerCase().replace(/ /g, '-'));

  if (isDuplicate) {
    notify(`"${movieName}" já está no seu carrinho!`);
    return;
  }
  
  const newItem = {
    id: movieName.toLowerCase().replace(/ /g, '-'), // ID único para o filme
    name: movieName,
    price: RENTAL_PRICE,
  };

  cart.push(newItem);
  renderCart();
  toggleCartSidebar(); // Abre o carrinho após adicionar

  notify(`"${movieName}" adicionado ao carrinho!`);
}

/** Remove um filme do carrinho pelo índice. */
function removeFromCart(index) {
  if (index > -1) {
    cart.splice(index, 1);
    renderCart();
  }
}


// --- Funções de Pagamento e Checkout ---

/** Abre o modal de pagamento. */
function openPaymentModal() {
  console.log('Tentando abrir modal de pagamento...'); // Ajuda de Debug

  if (cart.length === 0) {
    notify('Seu carrinho está vazio. Adicione filmes antes de finalizar a compra.');
    return;
  }
  
  cartSidebar.classList.remove('open'); // Fecha a barra lateral
  paymentModal.style.display = 'block'; // <<< ISTO DEVE ABRIR O MODAL
  console.log('Modal de pagamento aberto.'); // Ajuda de Debug
}

/** Fecha o modal de pagamento. */
function closePaymentModal() {
  paymentModal.style.display = 'none';
}

/** Fecha o modal de confirmação. */
function closeConfirmationModal() {
  confirmationModal.style.display = 'none';
  cart = []; // Limpa o carrinho
  renderCart(); // Atualiza a visualização
}

/** Simula a confirmação do pagamento. */
function confirmPayment() {
  const selectedOption = document.querySelector('input[name="payment"]:checked');

  if (!selectedOption) {
    notify('Por favor, selecione uma opção de pagamento.');
    return;
  }

  closePaymentModal(); // Fecha o modal de pagamento

  // Simula um delay de processamento (2 segundos)
  setTimeout(() => {
    
    const message = `Transação Aprovada! 🎉 O aluguel dos seus ${cart.length} filmes foi confirmado. Opção de pagamento: ${selectedOption.value}.`;

    confirmationMessageElement.innerHTML = message;
    confirmationModal.style.display = 'block'; // Abre o modal de confirmação
  }, 2000);
}

// Inicializa a exibição do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', renderCart);

// Fecha o modal se o usuário clicar fora dele
window.onclick = function(event) {
  if (event.target == paymentModal) {
    closePaymentModal();
  }
  if (event.target == confirmationModal) {
    closeConfirmationModal();
  }
}


// --- Controle dos Carrosseis ---
document.querySelectorAll(".carrossel-container").forEach(container => {
  
  const carrossel = container.querySelector(".carrossel");
  const btnLeft = container.querySelector(".btn-left");
  const btnRight = container.querySelector(".btn-right");

  const scrollAmount = 300; // px por clique

  // mover para esquerda
  btnLeft.addEventListener("click", () => {
    carrossel.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  // mover para direita
  btnRight.addEventListener("click", () => {
    carrossel.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });

});

// ===============================
// CAMPO DE BUSCA
// ===============================

const campoBusca = document.getElementById('campoBusca');
const filmes = document.querySelectorAll('.filme');

const secoesParaEsconder = [
  document.getElementById('destaque'),
  document.getElementById('populares'),
  document.getElementById('tituloPopulares'),
];

const todosH2 = document.querySelectorAll('h2');

const botoes1 = document.querySelectorAll('.btn.btn-right');
const botoes2 = document.querySelectorAll('.btn.btn-left');


// EVENTO DO CAMPO DE BUSCA
campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  const estaBuscando = termo !== '';

  // FILTRO DOS FILMES
  filmes.forEach(filme => {
    const nome = filme.querySelector('img').alt.toLowerCase();

    if (estaBuscando) {
      filme.style.display = nome.includes(termo) ? 'block' : 'none';
    } else {
      filme.style.display = ''; // volta ao CSS original
    }
  });

  // MOSTRAR / ESCONDER BOTÕES
  [...botoes1, ...botoes2].forEach(btn =>
    btn.style.display = estaBuscando ? 'none' : ''
  );

  // ESCONDER / MOSTRAR SEÇÕES
  secoesParaEsconder.forEach(secao => {
    if (secao) secao.style.display = estaBuscando ? 'none' : '';
  });

  // ESCONDER / MOSTRAR H2
  todosH2.forEach(h2 =>
    h2.style.display = estaBuscando ? 'none' : ''
  );
});

