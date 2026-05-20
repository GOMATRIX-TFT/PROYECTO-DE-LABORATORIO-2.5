const toggleTheme = () => {
  const html = document.documentElement;
  const button = document.getElementById('modoOscuro');
  const isDark = html.getAttribute('data-theme') === 'dark';

  if (isDark) {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    button.textContent = '⚡ Activa Turbo';
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    button.textContent = '🌙 Modo nocturno';
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const button = document.getElementById('modoOscuro');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    button.textContent = '🌙 Modo nocturno';
  }

  if (button) {
    button.addEventListener('click', toggleTheme);
  }

  const buttons = document.querySelectorAll('.floating-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('clicked');
      setTimeout(() => {
        btn.classList.remove('clicked');
      }, 300);
    });
  });
});