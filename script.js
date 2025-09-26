import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
        import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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

        // 🔹 Inicializa o Firebase
        const app = initializeApp(firebaseConfig);

        // 🔹 Conecta com o Firestore
        const db = getFirestore(app);

        // 🔹 Pega elementos da página
        const input = document.getElementById('avainput');
        const btn = document.getElementById('butao');
        const lista = document.getElementById('listaavaliacoes');

        // 🔹 Função para carregar avaliações do Firestore
        async function carregar() {
            lista.innerHTML = 'Carregando avaliações...';
            const avaliacoesCol = collection(db, 'avaliacoes'); // Seleciona a coleção

            try {
                const snapshot = await getDocs(avaliacoesCol); // Pega todos os documentos
                lista.innerHTML = ''; // Limpa lista
                snapshot.forEach(doc => {
                    const dados = doc.data();
                    const li = document.createElement('li');
                    li.textContent = dados.texto; // Pega o campo 'texto'
                    lista.appendChild(li);
                });
            } catch (error) {
                console.error("Erro ao carregar avaliações:", error);
                lista.innerHTML = "Não foi possível carregar as avaliações.";
            }
        }

        // 🔹 Função para enviar nova avaliação
        if (btn && input) {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const texto = input.value.trim();
                if (!texto) return;

                try {
                    await addDoc(collection(db, 'avaliacoes'), {
                        texto: texto,
                        data: new Date()
                    });
                    input.value = ''; // Limpa campo
                    carregar(); // Atualiza lista
                } catch (error) {
                    console.error("Erro ao adicionar avaliação:", error);
                    alert("Ocorreu um erro ao enviar sua avaliação.");
                }
            });
        }

        // 🔹 Carrega avaliações ao abrir a página
        carregar();