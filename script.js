// script.js
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'avaliacoes';

  const input = document.getElementById('avainput');
  const btn = document.getElementById('butao');
  const lista = document.getElementById('listaavaliacoes');

  function carregar() {
    if (!lista) return; // se a página não tiver a lista, sai
    lista.innerHTML = '';
    const avaliacoes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    avaliacoes.forEach(txt => {
      const li = document.createElement('li');
      li.textContent = txt;
      lista.appendChild(li);
    });
  }

  if (btn && input) {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // evita comportamento de submit se estiver em um form
      const texto = input.value.trim();
      if (!texto) return;
      const avaliacoes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      avaliacoes.push(texto);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(avaliacoes));
      input.value = '';
      carregar();
    });
  }

  // carrega ao abrir a página (tanto index quanto avalicao)
  carregar();
});