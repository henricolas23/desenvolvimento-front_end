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
                <button class="btn-diminuir" onclick="alterarQuantidade('${item.id}', ${item.quantidade - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantidade}</span>
                <button class="btn-aumentar" onclick="alterarQuantidade('${item.id}', ${item.quantidade + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <span class="mini-carrinho-preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            <button onclick="removerDoCarrinho('${item.id}')" class="btn-remover" title="Remover item">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        listaCarrinho.appendChild(li);
        total += item.preco * item.quantidade;
    });

    totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
    
    // Salva o carrinho no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarAoCarrinho(id, nome, preco) {
    // Encontra o botão clicado
    const btn = event.currentTarget;
    const produto = btn.closest('.produto');
    
    // Adiciona classe de animação ao produto
    produto.classList.add('adicionando-ao-carrinho');
    
    // Remove a classe após a animação
    setTimeout(() => {
        produto.classList.remove('adicionando-ao-carrinho');
    }, 700);

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
    
    // Desabilita o botão brevemente para evitar cliques múltiplos
    btn.disabled = true;
    setTimeout(() => {
        btn.disabled = false;
    }, 700);
    
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

// Pesquisa e Filtros
function pesquisarMedicamentos() {
    const termo = document.getElementById('pesquisa').value.toLowerCase().trim();
    const produtos = document.querySelectorAll('.produto');
    
    if (termo === '') {
        produtos.forEach(produto => {
            produto.style.display = 'block';
            produto.style.animation = 'fadeIn 0.5s ease forwards';
        });
        return;
    }
    
    produtos.forEach(produto => {
        const nome = produto.getAttribute('data-nome')?.toLowerCase() || '';
        const descricao = produto.querySelector('.produto-descricao')?.textContent.toLowerCase() || '';
        const categoria = produto.getAttribute('data-categoria')?.toLowerCase() || '';
        const sintomas = produto.getAttribute('data-sintomas')?.toLowerCase() || '';
        
        // Divide o termo de busca em palavras para busca parcial
        const termos = termo.split(' ').filter(t => t.length > 0);
        
        // Verifica se algum dos termos corresponde a qualquer um dos campos
        const corresponde = termos.some(t => 
            nome.includes(t) || 
            descricao.includes(t) || 
            categoria.includes(t) || 
            sintomas.includes(t)
        );
        
        if (corresponde) {
            produto.style.display = 'block';
            produto.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            produto.style.display = 'none';
        }
    });

    // Mostra mensagem quando não há resultados
    const resultadosVisiveis = Array.from(produtos).filter(p => p.style.display !== 'none').length;
    const mensagemContainer = document.getElementById('sem-resultados');
    
    if (resultadosVisiveis === 0) {
        if (!mensagemContainer) {
            const msg = document.createElement('div');
            msg.id = 'sem-resultados';
            msg.className = 'sem-resultados';
            msg.innerHTML = `
                <div class="mensagem-busca">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum resultado encontrado para "${termo}"</h3>
                    <p>Tente buscar por:</p>
                    <ul>
                        <li>Nome do medicamento</li>
                        <li>Sintomas (ex: dor, febre)</li>
                        <li>Categoria (ex: analgésico)</li>
                    </ul>
                </div>
            `;
            document.querySelector('.produtos').appendChild(msg);
        }
    } else if (mensagemContainer) {
        mensagemContainer.remove();
    }
}

function filtrarPorCategoria(event, filtro) {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const produtos = document.querySelectorAll('.produto');
    produtos.forEach(produto => {
        if (filtro === 'todos' || produto.getAttribute('data-categoria') === filtro) {
            produto.style.display = 'block';
            produto.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            produto.style.display = 'none';
        }
    });

    // Remove a mensagem de sem resultados se existir
    const mensagemContainer = document.getElementById('sem-resultados');
    if (mensagemContainer) {
        mensagemContainer.remove();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carrega o carrinho do localStorage
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }

    // Adiciona eventos aos botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (event) => filtrarPorCategoria(event, btn.getAttribute('data-filter')));
    });

    // Adiciona efeito de hover nos produtos
    document.querySelectorAll('.produto').forEach(produto => {
        produto.addEventListener('mouseenter', () => {
            produto.style.transform = 'translateY(-5px)';
            produto.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.15)';
        });

        produto.addEventListener('mouseleave', () => {
            produto.style.transform = 'translateY(0)';
            produto.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.1)';
        });
    });

    // Adiciona feedback visual aos botões
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
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

// Sistema de Registro
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
}

function toggleSenhaVisibilidade(button) {
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function fazerRegistro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem', 'error');
        return;
    }
    
    // Aqui você implementaria a lógica real de registro
    // Por enquanto, vamos apenas simular
    localStorage.setItem('usuarioRegistrado', JSON.stringify({
        nome,
        email,
        cpf,
        telefone
    }));
    
    mostrarMensagem('Conta criada com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Adiciona os eventos quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Formata CPF enquanto digita
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', () => formatarCPF(cpfInput));
    }
    
    // Formata telefone enquanto digita
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', () => formatarTelefone(telefoneInput));
    }
    
    // Adiciona eventos para mostrar/ocultar senha
    document.querySelectorAll('.toggle-senha').forEach(button => {
        button.addEventListener('click', () => toggleSenhaVisibilidade(button));
    });
});
