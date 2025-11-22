document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const searchInput = document.getElementById('caixa-busca');
    const searchButton = document.getElementById('botao-busca');
    const homeButton = document.getElementById('home');
    const modal = document.getElementById('anime-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.modal-close');


    let animesData = []; // Para armazenar os dados dos animes

    // Função para buscar os dados do JSON
    async function fetchAnimes() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            animesData = await response.json();
            displayAnimes(animesData);
        } catch (error) {
            console.error("Erro ao buscar os dados dos animes:", error);
            cardContainer.innerHTML = "<p>Não foi possível carregar os animes. Tente novamente mais tarde.</p>";
        }
    }

    // Função para exibir os cards na tela
    function displayAnimes(animes) {
        cardContainer.innerHTML = ''; // Limpa o container antes de adicionar novos cards
        animes.forEach((anime, index) => {
            const card = document.createElement('div');
            card.className = 'Card';
            // Adiciona um delay na animação para cada card, criando um efeito escalonado
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <img src="${anime.imagem}" alt="Capa de ${anime.nome}" style="width:100%; border-radius: 8px;">
                <h3 class="anime-name" data-anime-index="${index}">${anime.nome}</h3>
                <p>${anime.descricaoresumo}</p>
            `;
            cardContainer.appendChild(card);
        });

        // Adiciona os event listeners aos nomes dos animes depois que eles foram criados
        document.querySelectorAll('.anime-name').forEach(nameElement => {
            nameElement.addEventListener('click', (event) => {
                const animeIndex = event.target.getAttribute('data-anime-index');
                openModal(animesData[animeIndex]);
            });
        });
    }

    // Função para iniciar a busca
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        const filteredAnimes = animesData.filter(anime => {
            const nameMatch = anime.nome.toLowerCase().includes(searchTerm);
            const descriptionMatch = anime.descricao.toLowerCase().includes(searchTerm);
            // Verifica se alguma das tags corresponde ao termo de busca
            const tagsMatch = anime.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            return nameMatch || descriptionMatch || tagsMatch;
        });

        displayAnimes(filteredAnimes);
    }

    // Função para abrir e popular o modal
    function openModal(anime) {
        modalBody.innerHTML = `
            <img src="${anime.imagem}" alt="Capa de ${anime.nome}">
            <h2>${anime.nome} (${anime.data_lancamento})</h2>
            <p><strong>Tags:</strong> ${anime.tags.join(', ')}</p>
            <p>${anime.descricao}</p>
            <a href="${anime.link}" target="_blank">Saiba mais na Wikipedia</a>
        `;
        modal.style.display = 'block';
        document.body.classList.add('no-scroll'); // Impede o scroll da página principal
    }

    // Função para fechar o modal
    function closeTheModal() {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    // Event listeners para fechar o modal
    closeModal.addEventListener('click', closeTheModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeTheModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeTheModal();
        }
    });

    // Event listeners para a busca
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        // Realiza a busca ao pressionar a tecla Enter
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Event listener para o botão home
    homeButton.addEventListener('click', () => {
        searchInput.value = ''; // Limpa o campo de busca
        displayAnimes(animesData); // Exibe todos os animes novamente
    });

    // Inicia o processo carregando os dados
    fetchAnimes();
});