// Gerenciamento do carrinho
let carrinho = [];

function atualizarCarrinho() {
    const carrinhoIcone = document.getElementById('carrinho-quantidade');
    const quantidade = carrinho.reduce((total, item) => total + item.quantidade, 0);
    carrinhoIcone.textContent = quantidade;

    // Atualiza o mini carrinho
    const miniCarrinho = document.getElementById('mini-carrinho');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    
    listaCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.className = 'mini-carrinho-item';
        li.innerHTML = `
            <span>${item.nome}</span>
            <div>
                <button onclick="alterarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
            </div>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            <button onclick="removerDoCarrinho('${item.id}')" class="btn-remover">×</button>
        `;
        listaCarrinho.appendChild(li);
        total += item.preco * item.quantidade;
    });

    totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
    
    // Salva o carrinho no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id,
            nome,
            preco,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    mostrarMensagem('Produto adicionado ao carrinho!');
}

function alterarQuantidade(id, novaQuantidade) {
    if (novaQuantidade < 1) {
        removerDoCarrinho(id);
        return;
    }
    
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade = novaQuantidade;
        atualizarCarrinho();
    }
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
    mostrarMensagem('Produto removido do carrinho!');
}

function mostrarMensagem(texto, tipo = 'success') {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.classList.add('mostrar');
    
    setTimeout(() => {
        mensagem.classList.remove('mostrar');
    }, 3000);
}

// Toggle do mini carrinho
function toggleMiniCarrinho() {
    const miniCarrinho = document.getElementById('mini-carrinho');
    miniCarrinho.classList.toggle('aberto');
}

// Sistema de Pagamento
function togglePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.toggle('aberto');
}

function selecionarMetodoPagamento(metodo) {
    // Remove seleção anterior
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Adiciona seleção ao método atual
    document.querySelector(`[data-method="${metodo}"]`).classList.add('selected');
    
    // Esconde todos os detalhes
    document.querySelectorAll('.payment-details').forEach(el => {
        el.classList.remove('visible');
    });
    
    // Mostra os detalhes do método selecionado
    const detalhes = document.getElementById(`${metodo}-details`);
    if (detalhes) {
        detalhes.classList.add('visible');
    }
}

function formatarCartao(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value;
}

function formatarValidade(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
}

function calcularParcelas() {
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const select = document.getElementById('installments');
    select.innerHTML = '';
    
    for (let i = 1; i <= 12; i++) {
        const valor = (total / i).toFixed(2);
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}x de R$ ${valor}${i === 1 ? ' (sem juros)' : ' (com juros)'}`;
        select.appendChild(option);
    }
}

function finalizarCompra(event) {
    event.preventDefault();
    
    const metodoSelecionado = document.querySelector('.payment-method.selected');
    if (!metodoSelecionado) {
        mostrarMensagem('Por favor, selecione um método de pagamento', 'error');
        return;
    }
    
    // Aqui você implementaria a lógica real de pagamento
    // Por enquanto, vamos apenas simular
    mostrarMensagem('Compra realizada com sucesso! Em breve você receberá um e-mail com os detalhes.');
    carrinho = [];
    atualizarCarrinho();
    togglePaymentModal();
    toggleMiniCarrinho();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carrega o carrinho do localStorage
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }
});

// Sistema de login
function toggleLogin() {
    const modal = document.getElementById('login-modal');
    modal.classList.toggle('aberto');
}

function fazerLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    // Aqui você implementaria a lógica real de login
    // Por enquanto, vamos apenas simular
    if (email && senha) {
        localStorage.setItem('usuarioLogado', email);
        mostrarMensagem('Login realizado com sucesso!');
        toggleLogin();
        atualizarBotaoLogin();
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    atualizarBotaoLogin();
    mostrarMensagem('Logout realizado com sucesso!');
}

function atualizarBotaoLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const btnLogin = document.getElementById('btn-login');
    
    if (usuarioLogado) {
        btnLogin.innerHTML = `
            <span>${usuarioLogado}</span>
            <button onclick="fazerLogout()" class="btn-logout">Sair</button>
        `;
    } else {
        btnLogin.innerHTML = `<button onclick="toggleLogin()" class="btn">Entrar</button>`;
    }
}
