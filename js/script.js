document.addEventListener('DOMContentLoaded', function() {
  // Menu Mobile
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navList = document.querySelector('.nav-list');
  
  mobileMenuBtn.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('active');
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
  });
  
  // Fechar menu ao clicar em um link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navList.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    });
  });
  
  // Scroll suave para seções
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Ativar link ativo na navegação
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 50;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Efeito de scroll no header
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
  
  // Contador animado
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
      observer.observe(number);
    });
    
    function startCounter(element) {
      const target = parseInt(element.getAttribute('data-count'));
      const duration = 2000; // ms
      const step = target / (duration / 16); // 60fps
      let current = 0;
      
      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          clearInterval(counter);
          element.textContent = target;
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    }
  }
  
  // Slider de depoimentos
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentIndex = 0;
  
  if (testimonialCards.length > 0) {
    showTestimonial(currentIndex);
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      showTestimonial(currentIndex);
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
      showTestimonial(currentIndex);
    });
    
    function showTestimonial(index) {
      testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
          card.classList.add('active');
        }
      });
    }
  }
  
  // Modal de login/registro
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  
  function openModal(modal) {
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
  }
  
  function closeModal(modal) {
    document.body.style.overflow = 'auto';
    modal.classList.remove('active');
  }
  
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(loginModal);
  });
  
  registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(registerModal);
  });
  
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(registerModal);
  });
  
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModal);
    openModal(loginModal);
  });
  
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });
  
  // Validação de formulários
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulação de envio
      const formData = new FormData(this);
      const formName = this.getAttribute('id') || 'form';
      
      console.log(`Formulário ${formName} enviado:`, Object.fromEntries(formData));
      
      // Feedback visual
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      // Simular atraso de rede
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          
          // Mostrar mensagem de sucesso
          if (formName === 'contact-form' || formName === 'newsletter-form') {
            alert('Obrigado por entrar em contato! Responderemos em breve.');
            this.reset();
          } else if (formName === 'hero-form' || formName === 'cta-form') {
            alert('Obrigado pelo seu interesse! Em breve enviaremos mais informações.');
            this.reset();
          }
        }, 1000);
      }, 1500);
    });
  });
  
  // Carregamento lazy de imagens
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('src');
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Animação ao rolar
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.feature-card, .benefit-card, .pricing-card');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const animationPoint = 150;
      
      if (elementPosition < windowHeight - animationPoint) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Configurar animações iniciais
  const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .pricing-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Verificar elementos visíveis no carregamento
 
 
  window.addEventListener('keydown', (e) => { // Fechar com o ESC
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
    }
  });
  
  
});