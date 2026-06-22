document 
.getElementById("form-login")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;

    const senha = document.getElementById("login-senha").value;

    const resposta = await fetch(
        "http://localhost:3000/usuarios/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        }
    );
    if (resposta.ok) {

        const dados = await resposta.json();

        localStorage.setItem(
            "token",
            dados.token
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );

        window.location.href =
            "dashboard.html";
    } else {

        alert(
            "Email ou senha inválidos"
        );
    }

});