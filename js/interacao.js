// Arquivo: ../js/interacao.js
// Carrinho persistente e interações gerais (carrossel, busca, modais)

// Preço de aluguel
const RENTAL_PRICE = 7.9;

// Recupera carrinho do localStorage ou inicia vazio
let cart = JSON.parse(localStorage.getItem("carrinho")) || [];

// Funções de persistência
function saveCart() {
  localStorage.setItem("carrinho", JSON.stringify(cart));
}

// NOTIFICAÇÃO (usa o elemento #notify presente em index.html e detalhes.html)
function notify(text) {
  const n = document.getElementById("notify");
  if (!n) return;
  n.textContent = text;
  n.style.top = "20px";
  setTimeout(() => {
    n.style.top = "-60px";
  }, 2000);
}

/* ---------------------------
   Funções do Carrinho / UI
   --------------------------- */

function renderCartElements() {
  // Tenta obter os elementos; em páginas onde não existem, apenas ignora
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.getElementById('cart-count');

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Nenhum filme no carrinho.</p>';
  } else {
    cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.style.display = "flex";
      itemElement.style.justifyContent = "space-between";
      itemElement.style.alignItems = "center";
      itemElement.style.marginBottom = "8px";

      const info = document.createElement('div');
      info.innerHTML = `<div><strong style="color: #e6e6e6">${item.name}</strong></div><div style="font-size:14px">R$ ${item.price.toFixed(2).replace('.', ',')}</div>`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = "Remover";
      removeBtn.style.padding = "6px 10px";
      removeBtn.style.borderRadius = "6px";
      removeBtn.style.border = "none";
      removeBtn.style.cursor = "pointer";
      removeBtn.onclick = () => removeFromCart(index);

      itemElement.appendChild(info);
      itemElement.appendChild(removeBtn);

      cartItemsContainer.appendChild(itemElement);

      total += item.price;
    });
  }

  if (cartTotalElement) cartTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  if (cartCountElement) cartCountElement.textContent = cart.length;
}

// adicionar ao carrinho (usado tanto em index quanto em detalhes)
function addToCart(movieIdOrName) {
  // Normaliza o id (esperamos que o dev passe o ID correto como nas chaves de detalhes)
  const id = String(movieIdOrName).trim();

  // evita duplicata
  const already = cart.some(i => i.id === id);
  if (already) {
    notify(`"${id}" já está no seu carrinho!`);
    return;
  }

  // Mapeamento de ids para nomes legíveis (pode ser expandido)
  const names = {
    "demon-slayer": "Demon Slayer",
    "robocop": "Robocop",
    "uncharted": "Uncharted",
    "madmax": "Mad Max",
    "wandering": "Wandering",
    "thunderbolts": "Thunderbolts",
    "devoltaparaofuturo": "De Volta Para o Futuro",
    "soul": "Soul",
    "umafamiliafeliz": "Uma Família Feliz",
    "petsavidaselvagem": "Pets: A Vida Selvagem",
    "estreladebelem": "Estrela de Belém",
    "acaminhodecasa": "A Caminho de Casa",
    "divertidamente": "Divertidamente",
    "nacompanhiadomal": "Na Companhia do Mal",
    "sessao9": "Sessão 9",
    "cadaver": "Cadáver",
    "aentidade": "A Entidade",
    "itacoisa": "It: A Coisa",
    "falecomigo": "Fale Comigo",
    "super8": "Super 8",
    "naselva": "Na Selva",
    "dungeonsedragons": "Dungeons & Dragons",
    "agrandemuralha": "A Grande Muralha",
    "monsterhunter": "Monster Hunter",
    "osenhordosaneis": "O Senhor dos Anéis"
  };

  const name = names[id] || id;

  const newItem = {
    id,
    name,
    price: RENTAL_PRICE
  };

  cart.push(newItem);
  saveCart();
  renderCartElements();

  // tenta abrir a barra lateral se existir
  const cartSidebar = document.getElementById('cart-sidebar');
  if (cartSidebar) cartSidebar.classList.add('open');

  notify(`"${name}" adicionado ao carrinho!`);
}

// remove por índice
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  const removed = cart.splice(index, 1);
  saveCart();
  renderCartElements();
  notify(`"${removed[0].name}" removido do carrinho.`);
}

/* ---------------------------
   Pagamento / Modais
   --------------------------- */

function openPaymentModal() {
  if (cart.length === 0) {
    notify('Seu carrinho está vazio. Adicione filmes antes de finalizar a compra.');
    return;
  }
  const paymentModal = document.getElementById('payment-modal');
  const cartSidebar = document.getElementById('cart-sidebar');
  if (cartSidebar) cartSidebar.classList.remove('open');
  if (paymentModal) paymentModal.style.display = 'block';
}

function closePaymentModal() {
  const paymentModal = document.getElementById('payment-modal');
  if (paymentModal) paymentModal.style.display = 'none';
}

function closeConfirmationModal() {
  const confirmationModal = document.getElementById('confirmation-modal');
  if (confirmationModal) confirmationModal.style.display = 'none';
  // limpa carrinho após confirmação
  cart = [];
  saveCart();
  renderCartElements();
}

function confirmPayment() {
  const selectedOption = document.querySelector('input[name="payment"]:checked');
  if (!selectedOption) {
    notify('Por favor, selecione uma opção de pagamento.');
    return;
  }

  closePaymentModal();

  setTimeout(() => {
    const confirmationMessageElement = document.getElementById('confirmation-message');
    if (confirmationMessageElement) {
      confirmationMessageElement.innerHTML = `Transação Aprovada! 🎉 O aluguel dos seus ${cart.length} filmes foi confirmado. Opção de pagamento: ${selectedOption.value}.`;
    }

    const confirmationModal = document.getElementById('confirmation-modal');
    if (confirmationModal) confirmationModal.style.display = 'block';
  }, 1000);
}

/* ---------------------------
   Inicialização DOMContentLoaded
   --------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Atualiza UI do carrinho ao carregar
  renderCartElements();

  // FECHAR MODAIS clicando fora
  window.onclick = function(event) {
    const paymentModal = document.getElementById('payment-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    if (event.target == paymentModal) {
      closePaymentModal();
    }
    if (event.target == confirmationModal) {
      closeConfirmationModal();
    }
  };

  // CARROSSEIS (código original adaptado)
  document.querySelectorAll(".carrossel-container").forEach(container => {
    const carrossel = container.querySelector(".carrossel");
    const btnLeft = container.querySelector(".btn-left");
    const btnRight = container.querySelector(".btn-right");
    if (!carrossel || !btnLeft || !btnRight) return;

    const scrollAmount = 300;

    btnLeft.addEventListener("click", () => {
      carrossel.scrollBy({
        left: -scrollAmount,
        behavior: "smooth"
      });
    });

    btnRight.addEventListener("click", () => {
      carrossel.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    });
  });

  // CAMPO DE BUSCA (se existir)
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

  if (campoBusca) {
    campoBusca.addEventListener('input', () => {
      const termo = campoBusca.value.toLowerCase().trim();
      const estaBuscando = termo !== '';

      filmes.forEach(filme => {
        const img = filme.querySelector('img');
        const nome = img ? img.alt.toLowerCase() : '';
        if (estaBuscando) {
          filme.style.display = nome.includes(termo) ? 'block' : 'none';
        } else {
          filme.style.display = '';
        }
      });

      [...botoes1, ...botoes2].forEach(btn =>
        btn.style.display = estaBuscando ? 'none' : ''
      );

      secoesParaEsconder.forEach(secao => {
        if (secao) secao.style.display = estaBuscando ? 'none' : '';
      });

      todosH2.forEach(h2 =>
        h2.style.display = estaBuscando ? 'none' : ''
      );
    });
  }
});
