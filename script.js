document.addEventListener("DOMContentLoaded", ()=>{
// Espera todo o HTML carregar antes de rodar o JavaScript
// Isso evita erros ao tentar acessar elementos que ainda não existem na página


// ================= VARINHA =================
const wand = document.getElementById("wand"); // Pega o elemento com id "wand" (a varinha que segue o mouse)

document.addEventListener("mousemove",(e)=>{ // Evento que detecta o movimento do mouse na tela
  if(wand){ // Verifica se o elemento "wand" existe na página
    wand.style.left = e.clientX + "px"; // Move a varinha na horizontal de acordo com o mouse (posição X)
    wand.style.top = e.clientY + "px"; // Move a varinha na vertical de acordo com o mouse (posição Y)
  }
});

// ================= MAGIA CLIQUE =================
document.addEventListener("click",(e)=>{ // Evento que dispara quando o usuário clica na tela

  for(let i=0;i<20;i++){  // Cria 20 partículas de magia a cada clique
    let p=document.createElement("div");
    p.className="magic";

    let x=(Math.random()*200-100)+"px";   // Gera posição aleatória no eixo X (entre -100 e 100px)

    let y=(Math.random()*200-100)+"px";

    p.style.setProperty("--x",x);  // Passa o valor de X para o CSS (variável customizada)
    p.style.setProperty("--y",y);

    p.style.left=e.clientX+"px"; // Define onde a partícula nasce (posição do clique no eixo X)
    p.style.top=e.clientY+"px";

    document.body.appendChild(p);

    setTimeout(()=>p.remove(),1000);
  }
});

// ================= PERSONAGENS =================
const charDiv = document.getElementById("characters");

if(charDiv){

  fetch("https://hp-api.onrender.com/api/characters")
    .then(r=>r.json())
    .then(data=>{
      window.allChars = data;
      showChars(data);  // Mostra os personagens na tela
    });

  function showChars(list){  // Função que exibe personagens
    charDiv.innerHTML="";
    list.forEach(p=>{
      charDiv.innerHTML += `
      <div class="card">
        <img src="${p.image || 'https://via.placeholder.com/300'}">
        <h3>${p.name}</h3>
      </div>`;
       // Cria um card para cada personagem
      // Se não tiver imagem, usa imagem padrã
    });
  }

  const search = document.getElementById("search");

  if(search){
    search.addEventListener("input",(e)=>{
      let val = e.target.value.toLowerCase();
      let filtrado = allChars.filter(p =>
        p.name.toLowerCase().includes(val) // Filtra personagens que contêm o texto digitado
      );
      showChars(filtrado); // Atualiza a tela com os resultados filtrados
    });
  }
}

// ================= FEITIÇOS =================
const spellDiv = document.getElementById("spells");
const searchSpell = document.getElementById("searchSpell");

if(spellDiv){

  fetch("https://hp-api.onrender.com/api/spells")
    .then(r=>r.json())
    .then(data=>{
      window.allSpells = data;
      showSpells(data);
    });

  function showSpells(list){ // Função que exibe feitiços
    spellDiv.innerHTML="";
    list.slice(0,40).forEach(s=>{
      spellDiv.innerHTML += `
        <div class="card">
          <h3>${s.name}</h3>
          <p>${s.description || "Feitiço misterioso..."}</p>
        </div>
      `;
       // Cria card de cada feitiço
    });
  }

  if(searchSpell){
    searchSpell.addEventListener("input",(e)=>{
      let val = e.target.value.toLowerCase();

      let filtrados = allSpells.filter(s =>
        s.name.toLowerCase().includes(val)
      );
       // Filtra feitiços pelo nome

      showSpells(filtrados);
    });
  }
}

// ================= QUIZ =================
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");// Área das respostas// Área das respostas
const resultEl = document.getElementById("result");

if(questionEl && answersEl){
    // Só roda se estiver na página do quiz

const questions = [
  {q:"Qual qualidade te define?",a:[["Coragem","Gryffindor"],["Ambição","Slytherin"],["Inteligência","Ravenclaw"],["Lealdade","Hufflepuff"]]},
  {q:"O que você faria em perigo?",a:[["Lutaria","Gryffindor"],["Planejaria","Slytherin"],["Pensaria","Ravenclaw"],["Ajudaria","Hufflepuff"]]},
  {q:"Qual lugar prefere?",a:[["Campo","Gryffindor"],["Lugar secreto","Slytherin"],["Biblioteca","Ravenclaw"],["Casa","Hufflepuff"]]},
  {q:"Qual animal te representa?",a:[["Leão","Gryffindor"],["Cobra","Slytherin"],["Coruja","Ravenclaw"],["Texugo","Hufflepuff"]]},
  {q:"Qual matéria gosta mais?",a:[["Defesa","Gryffindor"],["Poções","Slytherin"],["Feitiços","Ravenclaw"],["Herbologia","Hufflepuff"]]},
  {q:"Qual é seu maior objetivo?",a:[["Ser herói","Gryffindor"],["Ter poder","Slytherin"],["Aprender tudo","Ravenclaw"],["Ajudar todos","Hufflepuff"]]},
  {q:"Como seus amigos te veem?",a:[["Valente","Gryffindor"],["Esperto","Slytherin"],["Inteligente","Ravenclaw"],["Gentil","Hufflepuff"]]},
  {q:"O que faria com um segredo?",a:[["Protegeria","Gryffindor"],["Usaria a favor","Slytherin"],["Estudaria","Ravenclaw"],["Guardaria","Hufflepuff"]]}
];

let index = 0; // Controla a pergunta atual
let score = {Gryffindor:0,Slytherin:0,Ravenclaw:0,Hufflepuff:0};

function loadQuestion(){ // Carrega pergunta na tela
  let q = questions[index];
  questionEl.innerText = q.q;
   // Mostra a pergunta
  answersEl.innerHTML = "";// Limpa respostas antigas

  q.a.forEach(opt=>{  // Para cada alternativa

    let btn = document.createElement("button");
    btn.innerText = opt[0];

    btn.onclick = ()=>{
      score[opt[1]]++; // Soma ponto para a casa escolhida
      index++; // Vai para próxima pergunta


      if(index < questions.length){
        loadQuestion();
      } else {
        showResult();
      }
    };

    answersEl.appendChild(btn);
  });
}

function showResult(){
  let win = Object.keys(score).reduce((a,b)=> score[a]>score[b]?a:b);  // Descobre qual casa teve mais pontos
  let nome = document.getElementById("nome").value || "Bruxo";

  resultEl.innerText = `${nome}, você é ${win}! `;

  gerarPerfilFinal(win);

  questionEl.innerText = " Quiz concluído!";
  answersEl.innerHTML = "";
}

// ================= PERFIL FINAL =================
function gerarPerfilFinal(casa){ // Gera perfil aleatório mágico

  const varinhas = ["Carvalho","Azevinho","Teixo","Cerejeira"];
  const nucleos = ["Fênix","Dragão","Unicórnio"];
  const patronos = ["Cervo","Lobo","Águia","Cavalo"];
  const feiticos = ["Expelliarmus","Expecto Patronum","Lumos","Alohomora"];

  let varinha = varinhas[Math.floor(Math.random()*varinhas.length)];
  let nucleo = nucleos[Math.floor(Math.random()*nucleos.length)];
  let patrono = patronos[Math.floor(Math.random()*patronos.length)];
  let feitico = feiticos[Math.floor(Math.random()*feiticos.length)];

  document.getElementById("perfil").innerHTML =
  `
  <div class="perfil-card">
    <h3>🧙‍♂️ Seu Perfil Mágico</h3>
    <p> <strong>Casa:</strong> ${casa}</p>
    <p> <strong>Varinha:</strong> ${varinha} com núcleo de ${nucleo}</p>
    <p> <strong>Feitiço:</strong> ${feitico}</p>
    <p>  <strong>Patrono:</strong> ${patrono}</p>
  </div>
  `;
}

loadQuestion();

}

});