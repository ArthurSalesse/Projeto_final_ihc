function mostrarMensagem(texto, tempo = 2500) {
    const msg = document.getElementById("msg");
    if (!msg) return;
    msg.textContent = texto;
    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
    }, tempo);
}

// Salvar novo usuário
function cadastrarUsuario(email, senha) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.email === email)) return false;

    usuarios.push({ email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
}

// Autenticar login
function autenticar(email, senha) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        return true;
    }
    return false;
}

// Logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.reload();
}

// Atualizar interface do index.html
function atualizarIndex() {
    let user = JSON.parse(localStorage.getItem("usuarioLogado"));
    const loginBtn = document.getElementById("btnLogin");
    const welcome = document.getElementById("welcomeUser");
    const logoutBtn = document.getElementById("btnLogout");

    if (user) {
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (welcome) welcome.textContent = `Olá, ${user.email}`;
    } else {
        if (welcome) welcome.textContent = "";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginBtn) loginBtn.style.display = "inline-block";
    }
}

// EVENTOS DOS FORMULÁRIOS
document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formRegistro");
    const formLogin = document.getElementById("formLogin");

    // Cadastro
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const senha1 = document.getElementById("senha1").value;
            const senha2 = document.getElementById("senha2").value;

            if (senha1 !== senha2) {
                mostrarMensagem("⚠️ As senhas não coincidem!");
                return;
            }

            if (cadastrarUsuario(email, senha1)) {
                mostrarMensagem("✔ Cadastro realizado com sucesso!", 2000);

                // Redirecionar para o LOGIN após 1s
                setTimeout(() => {
                    window.location.href = "index_login.html";
                }, 1200);

            } else {
                mostrarMensagem("⚠️ Este email já está cadastrado!");
            }
        });
    }

    // Login
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            if (autenticar(email, senha)) {
                // NENHUMA MENSAGEM — apenas redireciona
                window.location.href = "index.html";
            } else {
                mostrarMensagem("❌ Email ou senha incorretos!");
            }
        });
    }

    // Atualizar tela inicial
    atualizarIndex();
});
