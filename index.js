require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configuração de arquivos estáticos
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Armazena mensagens na memória (tempo de execução)
const mensagens = [];

// Configuração do Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Página Inicial
app.get("/", (req, res) => {
    res.render("Formulario"); // Alterado para renderizar Formulario.handlebars
});

// Rota para obter mensagens salvas na memória
app.get("/mensagens", (req, res) => {
    res.json(mensagens);
});

// Rota para enviar mensagem e obter resposta
app.post("/enviar-mensagem", async (req, res) => {
    const { mensagem } = req.body;

    if (!mensagem) {
        return res.status(400).json({ erro: "Nenhuma mensagem fornecida!" });
    }

    try {
        const result = await model.generateContent(mensagem);
        const resposta = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao obter resposta";
 
        // Salva na memória
        mensagens.unshift({ mensagem, resposta });

        res.json({ resposta });
    } catch (error) {
        console.error("Erro ao chamar o Gemini AI:", error);
        res.status(500).json({ erro: "Erro ao processar a resposta" });
    }
});

// Inicia o Servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
