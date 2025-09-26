import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// 🔹 Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAvnmY5oH6t6UDpeLXWsC4H9FzTxui2kJs",
    authDomain: "cardapio-c3956.firebaseapp.com",
    projectId: "cardapio-c3956",
    storageBucket: "cardapio-c3956.firebasestorage.app",
    messagingSenderId: "392232652861",
    appId: "1:392232652861:web:7f7dcb5eaa4f21a2609a54",
    measurementId: "G-S4RFGBL3TT"
};

// 🔹 Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Pega elementos
const nomeInput = document.getElementById('nomeInput');
const input = document.getElementById('avainput');
const btn = document.getElementById('butao');
const lista = document.getElementById('listaavaliacoes');

// 🔹 Função para carregar avaliações
async function carregar() {
    lista.innerHTML = 'Carregando avaliações...';
    const avaliacoesCol = collection(db, 'avaliacoes');
    const q =query(avaliacoesCol, orderBy("data", ("desc")))

    try {
        const snapshot = await getDocs(q);
        lista.innerHTML = '';

        snapshot.forEach(docSnap => {
            const dados = docSnap.data();

            // Converter a data salva no Firestore
            const data = dados.data?.toDate ? dados.data.toDate() : new Date(dados.data);
            const dataFormatada = data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${dados.nome}</strong> - ${dados.texto}
                <br><small>${dataFormatada}</small>
            `;
            lista.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        lista.innerHTML = "Não foi possível carregar as avaliações.";
    }
}

// 🔹 Função para enviar avaliação
if (btn && input && nomeInput) {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const texto = input.value.trim();
        const nome = nomeInput.value.trim();

        if (!texto || !nome) {
            alert("Preencha seu nome e sua avaliação!");
            return;
        }

        try {
            await addDoc(collection(db, 'avaliacoes'), {
                nome: nome,
                texto: texto,
                data: new Date()
            });
            input.value = '';
            nomeInput.value = '';
            carregar();
        } catch (error) {
            console.error("Erro ao adicionar avaliação:", error);
            alert("Ocorreu um erro ao enviar sua avaliação.");
        }
    });
}

// 🔹 Carrega ao abrir a página
carregar();