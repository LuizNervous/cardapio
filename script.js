document.addEventListener('DOMContentLoaded', () => {
  // Pega a conexão com o Firestore que criamos no HTML
  // (As funções collection, addDoc e getDocs vêm do Firestore)
  const { collection, addDoc, getDocs } =
    "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

  // Pega os elementos da tela, igual ao seu código antigo
  const input = document.getElementById('avainput');
  const btn = document.getElementById('butao');
  const lista = document.getElementById('listaavaliacoes');
  
  // Pega a conexão com o banco de dados que definimos no HTML
  const db = window.db; 

  // ✨ FUNÇÃO PARA CARREGAR AS AVALIAÇÕES DO FIREBASE
  // Esta função agora é 'async' pois conversar com a internet leva um tempo
  async function carregar() {
    if (!lista) return;

    lista.innerHTML = 'Carregando avaliações...'; // Mostra uma mensagem
    const avaliacoesCol = collection(db, 'avaliacoes'); // Referência da sua coleção
    
    try {
      // Busca os documentos da coleção no Firebase
      const snapshot = await getDocs(avaliacoesCol);
      lista.innerHTML = ''; // Limpa a lista antes de adicionar as novas

      snapshot.forEach(doc => {
        // Para cada documento encontrado...
        const dados = doc.data(); // Pega os dados de dentro dele
        const txt = dados.texto;  // Pegamos o campo "texto"

        const li = document.createElement('li');
        li.textContent = txt;
        lista.appendChild(li);
      });
    } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        lista.innerHTML = "Não foi possível carregar as avaliações.";
    }
  }

  // ✨ FUNÇÃO PARA ENVIAR UMA NOVA AVALIAÇÃO
  if (btn && input) {
    // A função do clique também vira 'async'
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const texto = input.value.trim();
      if (!texto) return; // Não faz nada se o campo estiver vazio

      try {
        // Adiciona um novo documento na coleção 'avaliacoes'
        // O documento será um objeto com o texto e a data
        await addDoc(collection(db, "avaliacoes"), {
          texto: texto,
          data: new Date() // Salva a data que foi enviado
        });

        input.value = ''; // Limpa o campo de texto
        carregar(); // Recarrega a lista para mostrar a nova avaliação

      } catch (error) {
        console.error("Erro ao adicionar avaliação: ", error);
        alert("Ocorreu um erro ao enviar sua avaliação.");
      }
    });
  }

  // Carrega as avaliações assim que a página abre
  carregar();
});