import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc  } 
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

function gerarEstrelas(nota) {
    let estrelasHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < nota) {
            estrelasHtml += '★'; // Estrela preenchida
        } else {
            estrelasHtml += '☆'; // Estrela vazia
        }
    }
    return `<div class="rating-display">${estrelasHtml}</div>`;
}

// 🔹 Função para carregar avaliações
async function carregar() {
    lista.innerHTML = 'Carregando avaliações...';
    const avaliacoesCol = collection(db, 'avaliacoes');
    const q = query(avaliacoesCol, orderBy("data", "desc"));

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

            const estrelasDisplay=gerarEstrelas(dados.estrelas || 0)

            li.innerHTML = `
                ${estrelasDisplay}
                <strong>${dados.nome}</strong> - ${dados.texto}
                <br><small>${dataFormatada}</small>
            `;

            // Cria botão de excluir
            const btnExcluir = document.createElement('button');
            


            // Ação do botão
            btnExcluir.addEventListener('click', async () => {
                if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
                    try {
                        // Usando a referência correta do documento com a função 'doc'
                        await deleteDoc(doc(db, "avaliacoes", docSnap.id));
                        carregar(); // Recarrega a lista
                    } catch (error) {
                        console.error("Erro ao excluir:", error);
                        alert("Não foi possível excluir a avaliação.");
                    }
                }
            });

            // ✅ LINHA ADICIONADA: Adiciona o botão de excluir ao item da lista (li)
           

            // ✅ LINHA ADICIONADA: Adiciona o item da lista (li) à lista principal (ul)
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
        const starRating = document.querySelector('input[name="rating"]:checked')
        if (!texto || !nome) {
            alert("Preencha seu nome e sua avaliação!");
            return;
        }
        if (!starRating) {
            alert("Por favor, selecione uma das estrelas");
            return;
        }
        const nota=parseInt(starRating.value);

        try {
            await addDoc(collection(db, 'avaliacoes'), {
                nome: nome,
                texto: texto,
                estrelas:nota,
                data: new Date()
            });
            input.value = '';
            nomeInput.value = '';
            starRating.checked=false;
            carregar();
        } catch (error) {
            console.error("Erro ao adicionar avaliação:", error);
            alert("Ocorreu um erro ao enviar sua avaliação.");
        }
    });
}

// 🔹 Carrega ao abrir a página
carregar();