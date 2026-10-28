const Personagem = (() => {

    const SENHA_MESTRA_CRIACAO = "SuaSenhaMestraAqui123"; 

    class ClassePersonagem {
        static #chaveSecreta = Symbol('Rap é compromisso');
        #senhaVerdadeira; 

        constructor(chave, foto, nome, idade, nacionalidade, naturalidade, cena, estilo, grupo, senhaDefinida) {
            if (chave !== ClassePersonagem.#chaveSecreta) {
                throw new Error("Erro: O construtor é privado.");
            }

            this.foto = foto;
            this.nome = nome;
            this.idade = idade;
            this.nacionalidade = nacionalidade;
            this.naturalidade = naturalidade;
            this.cena = cena;
            this.estilo = estilo;
            this.grupo = grupo;

            this.#senhaVerdadeira = senhaDefinida;

            Object.freeze(this);
        }


        static criar(senhaMestraDigitada, foto, nome, idade, nacionalidade, naturalidade, cena, estilo, grupo, senhaInternaDoPersonagem) {
            
            if (senhaMestraDigitada !== SENHA_MESTRA_CRIACAO) {
                throw new Error("❌ Acesso negado: Senha mestra de criação inválida. Injeção bloqueada!");
            }

            return new ClassePersonagem(
                ClassePersonagem.#chaveSecreta, 
                foto, 
                nome, 
                idade, 
                nacionalidade, 
                naturalidade, 
                cena, 
                estilo, 
                grupo, 
                senhaInternaDoPersonagem 
            );
        }

        verificarSenha(senhaDigitada) {
            return this.#senhaVerdadeira === Array.isArray(senhaDigitada) ? false : senhaDigitada;
        }
    }

    return ClassePersonagem;
})();


const chute = document.getElementById('chute');
const enviar_chute = document.getElementById('enviar-chute');
const listaResultados = document.getElementById('lista-resultados');

let tentativa;

enviar_chute.addEventListener('click', ()=>{
    tentativa = chute.value;
    chute.value = '';
});

chute.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    listaResultados.innerHTML = '';

    if (termo.length === 0) {
      listaResultados.classList.add('hidden');
      return;
    }

    const filtrados = usuarios.filter(u => u.nome.toLowerCase().includes(termo));

    if (filtrados.length > 0) {
      filtrados.forEach(usuario => {
        const item = document.createElement('div');
        item.classList.add('result-item');

        item.innerHTML = `
          <img src="${usuario.foto}" alt="${usuario.nome}">
          <span>${usuario.nome}</span>
        `;

        item.addEventListener('click', () => {
          inputBusca.value = usuario.nome;
          listaResultados.classList.add('hidden');
        });

        listaResultados.appendChild(item);
      });
      
      listaResultados.classList.remove('hidden');
    } else {
      listaResultados.classList.add('hidden');
    }
  });
ç
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      listaResultados.classList.add('hidden');
    }
  });

