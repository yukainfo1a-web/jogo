(() => {
  'use strict';

  const FabricaPersonagens = (() => {
    const CHAVE_PRIVADA = Symbol('Rap é compromisso');

    class Personagem {
      constructor(chave, dados) {
        if (chave !== CHAVE_PRIVADA) {
          throw new Error('Acesso negado: construtor privado.');
        }

        const fotoValida = typeof dados.foto === 'string' && 
          (dados.foto.startsWith('data:image/') || dados.foto.startsWith('https://'));

        this.foto = fotoValida ? dados.foto : './img/padrao.png';
        this.nome = String(dados.nome || 'Desconhecido');
        this.idade = Number(dados.idade) || 0;
        this.nacionalidade = String(dados.nacionalidade || '');
        this.naturalidade = String(dados.naturalidade || '');
        this.cena = String(dados.cena || '');
        this.estilo = String(dados.estilo || '');
        this.grupo = String(dados.grupo || '');

        Object.freeze(this);
      }
    }

    function importarJson(listaBruta) {
      if (!Array.isArray(listaBruta)) {
        throw new Error('Formato inválido: o JSON precisa ser uma lista.');
      }

      const personagensSeguros = listaBruta.map(item => new Personagem(CHAVE_PRIVADA, item));
      return Object.freeze(personagensSeguros);
    }

    return Object.freeze({ importarJson });
  })();

  let usuarios = Object.freeze([]);
  let personagemSecreto = null;

  const chute = document.getElementById('chute');
  const enviarChute = document.getElementById('enviar-chute');
  const listaResultados = document.getElementById('lista-resultados');

  async function iniciarJogo() {
    try {
      const resposta = await fetch('./personagens.json', { cache: 'no-store' });
      if (!resposta.ok) throw new Error('Falha ao buscar o arquivo JSON.');

      const dadosJson = await resposta.json();
      usuarios = FabricaPersonagens.importarJson(dadosJson);

      if (usuarios.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * usuarios.length);
        personagemSecreto = usuarios[indiceAleatorio];
      }
    } catch (erro) {
      console.error('Erro de inicialização:', erro.message);
    }
  }

  function renderizarSugestoes(filtrados) {
  listaResultados.replaceChildren();

  if (filtrados.length === 0) {
    const aviso = document.createElement('div');
    aviso.classList.add('result-item', 'sem-resultados');
    aviso.textContent = 'Não tem ninguém com esse nome.';
    
    listaResultados.appendChild(aviso);
    listaResultados.classList.remove('hidden');
    return;
  }

  const fragmento = document.createDocumentFragment();

    filtrados.forEach(usuario => {
      const item = document.createElement('div');
      item.classList.add('result-item');

      const img = document.createElement('img');
      img.src = usuario.foto;
      img.alt = usuario.nome;

      const span = document.createElement('span');
      span.textContent = usuario.nome; 

      item.append(img, span);

      item.addEventListener('click', () => {
        chute.value = usuario.nome;
        listaResultados.hidden = true;
      });

      fragmento.appendChild(item);
    });

    listaResultados.appendChild(fragmento);
    listaResultados.classList.remove('hidden');
  }


  // 5. EVENTOS DO JOGO
  chute.addEventListener('input', (e) => {
    const termo = e.target.value.trim().toLowerCase();

    if (termo.length === 0) {
      listaResultados.hidden = true;
      return;
    }else{
      listaResultados.hidden = false;
    }

    const filtrados = usuarios.filter(u => u.nome.toLowerCase().includes(termo));
    renderizarSugestoes(filtrados);
  });

  enviarChute.addEventListener('click', () => {
    if (!personagemSecreto) return;

    const tentativa = chute.value.trim();
    if (!tentativa) return;

    const palpite = usuarios.find(u => u.nome.toLowerCase() === tentativa.toLowerCase());

    // Se não encontrar ninguém, apenas para a execução sem dar alert
    if (!palpite) return;

    chute.value = '';
    listaResultados.classList.add('hidden');

    if (palpite.nome === personagemSecreto.nome) {
      alert(`Parabéns! Você acertou: ${personagemSecreto.nome}`);
    } else {
      console.log('Palpite registrado:', palpite);
    }
  });


  document.addEventListener('click', (e) => {
    if (!e.target.closest('#conteiner-procura')) {
      listaResultados.classList.add('hidden');
    }
  });

  iniciarJogo();
})();
