 const wrap = document.querySelector('.img-wrap');
  const imgs = document.querySelectorAll('.img-wrap img');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let idx = 0;

  function showImg() {
    if (idx < 0) idx = imgs.length - 1;
    if (idx >= imgs.length) idx = 0;
    wrap.style.transform = `translateX(-${idx * 100}%)`;
  }

  prev.addEventListener('click', () => {
    idx--;
    showImg();
  });
  next.addEventListener('click', () => {
    idx++;
    showImg();
  });

  // Autoplay cada 3 segundos
  setInterval(() => {
    idx++;
    showImg();
  }, 3000);

  showImg();  // Mostrar la imagen inicial
  
    // Función para alternar el tema
    function toggleTheme() {
      const html = document.documentElement;
      const button = document.querySelector('.modo-btn');
      const currentTheme = html.getAttribute("data-theme");
      if (currentTheme === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        if (button) button.textContent = '⚡ Activa Turbo';
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        if (button) button.textContent = '🌙 Modo nocturno';
      }
    }

    // Cargar el tema guardado al cargar la página
    window.addEventListener("DOMContentLoaded", () => {
      const savedTheme = localStorage.getItem("theme");
      const button = document.querySelector('.modo-btn');
      if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (button) button.textContent = '🌙 Modo nocturno';
      }
    });

    // Partículas animadas estilo chispa
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const maxParticles = 60;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.5 + 0.5
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFD600';

      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });