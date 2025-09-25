const input= document.getElementById("avainput");
const btn= document.getElementsById("butao");
const lista = document.getElementById("listaavaliações");

function carregar(){
  lista.innerHTML="";
  const avaliacoes = JSON.parse(localStorage.getItem(avaliacoes)) || [];
  avaliacoes.forEach(txt => {
    const li = document.createElement("li");
    li.textContent= txt;
    lista.appendChild(li);
  });
}
btn.addEventListener("click" , () => {
   
  const texto=input.value.trim();
  if(texto){
    const avaliacoes= JSON.parse(localStorage.getItem("avaliacoes")) || [];
    avaliacoes.push(texto);
    localStorage.setItem("avaliacoes", JSON.stringify (avaliacoes))
    input.value="";
    carregar();
  }
})
 carregar();