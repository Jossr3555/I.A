document.getElementById("mensagemForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const mensagem = document.getElementById("inputMensagem").value;
    const respostaElemento = document.getElementById("resposta");

    if (!mensagem) {
        respostaElemento.textContent = "Digite uma mensagem!";
        return;
    }

    respostaElemento.textContent = "Aguarde...";

    try {
        const response = await fetch("/enviar-mensagem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem })
        });

        const data = await response.json();
        respostaElemento.textContent = data.resposta;

        // Atualiza a lista de mensagens
        carregarMensagens();
    } catch (error) {
        respostaElemento.textContent = "Erro ao conectar com a IA!";
        console.error(error);
    }

    document.getElementById("inputMensagem").value = "";
});

async function carregarMensagens() {
    try {
        const response = await fetch("/mensagens");
        const data = await response.json();

        const lista = document.getElementById("mensagensLista");
        lista.innerHTML = "";

        data.forEach(msg => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `${msg.mensagem} → ${msg.resposta}`;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
    }
}

// Carrega mensagens ao iniciar
carregarMensagens();
