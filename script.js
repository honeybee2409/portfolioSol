document.addEventListener('DOMContentLoaded', function() {
    // ------------------------------------- //
    // 1. Smooth scroll para os links da navegação
    // ------------------------------------- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ------------------------------------- //
    // 2. Efeito de "fade-in" para seções ao rolar
    // ------------------------------------- //
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // observer.unobserve(entry.target); // Para animar apenas uma vez
            } else {
                // entry.target.style.opacity = '0'; // Opcional: redefinir ao sair da tela
                // entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });

    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }

    // ------------------------------------- //
    // 3. Funcionalidade do Modal (Lightbox)
    // ------------------------------------- //
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    let currentImageIndex = 0;
    let imagesInCurrentView = []; // Armazenará as imagens VISÍVEIS na categoria ativa para navegação

    function openModal(itemIndex) {
        if (imagesInCurrentView.length === 0) return;

        currentImageIndex = itemIndex;
        updateModalContent();

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateModalContent() {
        if (imagesInCurrentView.length === 0) return;

        const currentImageElement = imagesInCurrentView[currentImageIndex];
        modalImage.src = currentImageElement.dataset.fullSrc || currentImageElement.src;
        modalDescription.textContent = currentImageElement.dataset.description || currentImageElement.alt;

        if (imagesInCurrentView.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + imagesInCurrentView.length) % imagesInCurrentView.length;
        updateModalContent();
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % imagesInCurrentView.length;
        updateModalContent();
    });

    // ------------------------------------- //
    // 4. Funcionalidade de filtro da galeria
    // ------------------------------------- //
    const categoryTabs = document.querySelectorAll('.tab-button');
    const allArtItems = document.querySelectorAll('.art-item');

    function filterArt(category) {
        allArtItems.forEach(item => {
            if (category === 'all') { // Esta é a categoria "Destaques" no HTML
                if (item.dataset.highlight === 'true') { // Verifica se o item tem o atributo data-highlight="true"
                    item.style.display = 'flex'; // Exibe como flex
                } else {
                    item.style.display = 'none'; // Oculta itens que não são destaque
                }
            } else {
                // Para outras categorias, verifica o data-category do item
                if (item.dataset.category === category) {
                    item.style.display = 'flex'; // Exibe como flex
                } else {
                    item.style.display = 'none'; // Oculta itens de outras categorias
                }
            }
        });

        // IMPORTANTE: Após filtrar, RECONSTRUIR a lista imagesInCurrentView para o modal
        imagesInCurrentView = Array.from(allArtItems).filter(item => {
            return item.style.display !== 'none'; // Apenas inclua itens que estão atualmente visíveis
        }).map(item => item.querySelector('img')); // Mapeia para os elementos <img> internos

        currentImageIndex = 0; // Resetar o índice ao mudar de categoria
    }

    // Adiciona Event Listeners para abrir o modal em cada item de arte
    allArtItems.forEach((item) => {
        item.addEventListener('click', () => {
            const clickedImgElement = item.querySelector('img');
            // Encontra o índice do item clicado DENTRO da lista imagesInCurrentView (já filtrada)
            const indexInVisibleList = imagesInCurrentView.findIndex(img => img === clickedImgElement);

            if (indexInVisibleList !== -1) {
                openModal(indexInVisibleList);
            }
        });
    });

    // Event Listeners para os botões de categoria (abas)
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e adiciona ao clicado
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Chama a função de filtro com a categoria do botão clicado
            filterArt(tab.dataset.category);
        });
    });

    // ------------------------------------- //
    // 5. Inicialização: Exibir a categoria "Destaques" ao carregar a página
    // ------------------------------------- //
    const destaquesTab = document.querySelector('.tab-button[data-category="all"]');
    if (destaquesTab) {
        destaquesTab.click(); // Simula um clique na aba "Destaques" ao carregar a página
    }
});