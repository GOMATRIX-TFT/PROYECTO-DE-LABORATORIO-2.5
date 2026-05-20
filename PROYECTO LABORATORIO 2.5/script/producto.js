// VARIABLES GLOBALES
let carrito = [];
let comboSeleccion = new Set();

// AGREGAR PRODUCTO AL CARRITO
function addToCart(id) {
  const producto = document.querySelector(`.producto[data-id='${id}']`);
  if (!producto) return;

  const precio = parseFloat(producto.dataset.precio);
  const nombre = producto.dataset.nombre;

  // Verificar si ya está en el carrito
  const existe = carrito.find(item => item.id === id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  renderCart();
  updateCartBadge();
  showCart();
  updateComboTotal();
}

// ELIMINAR PRODUCTO DEL CARRITO
function removeFromCart(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderCart();
  updateCartBadge();
  updateComboTotal();
}

// RENDERIZAR CARRITO EN EL DOM
function renderCart() {
  const cont = document.getElementById('carrito');
  cont.innerHTML = '';

  let total = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidad;

    const li = document.createElement('li');
    li.className = 'carrito-item';
    li.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>Q${(item.precio * item.cantidad).toFixed(2)} 
        <button class="btn-eliminar" onclick="removeFromCart(${item.id})" aria-label="Eliminar ${item.nombre}">&times;</button>
      </span>
    `;
    cont.appendChild(li);
  });

  document.getElementById('total').innerText = total.toFixed(2);
}

// TOGGLE VISIBILIDAD DEL CARRITO
function toggleCart() {
  const cc = document.getElementById('carritoContainer');
  cc.classList.toggle('open');
}

// MOSTRAR CARRITO (por ejemplo después de agregar producto)
function showCart() {
  const cc = document.getElementById('carritoContainer');
  cc.classList.add('open');
}

// ACTUALIZAR EL CONTADOR BURBUJA DEL CARRITO
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  badge.innerText = cantidad;
  badge.style.display = cantidad > 0 ? 'inline-block' : 'none';
}

// TOGGLE MODO NOCTURNO
function toggleNightMode() {
  const html = document.documentElement;
  const icon = document.getElementById('darkToggleIcon');
  const button = icon ? icon.closest('button') : null;

  if (html.getAttribute('data-theme') === 'dark') {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    if (button) button.innerHTML = '<span id="darkToggleIcon">⚡</span> Activa Turbo';
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (button) button.innerHTML = '<span id="darkToggleIcon">🌞</span> Modo nocturno';
  }
}

// CONSTRUCTOR DE COMBOS - GENERAR LISTA DE PRODUCTOS CON CHECKBOX
function buildComboList() {
  const comboList = document.getElementById('comboList');
  if (!comboList) return; // evitar errores si no existe
  // Reconstruir la lista de combos desde cero y reiniciar selección
  comboList.innerHTML = '';
  comboSeleccion = new Set();

  // Generar items de combo a partir de los productos visibles
  document.querySelectorAll('.producto').forEach(prod => {
    const id = parseInt(prod.dataset.id);
    const nombre = prod.dataset.nombre || prod.querySelector('h3')?.innerText || 'Producto';
    const precio = parseFloat(prod.dataset.precio) || 0;

    const div = document.createElement('div');
    div.className = 'combo-item';
    div.innerHTML = `
      <label>
        <input type="checkbox" data-id="${id}" data-precio="${precio}">
        <span class="combo-label">${nombre} - Q${precio.toFixed(2)}</span>
      </label>
    `;

    comboList.appendChild(div);
  });

  // Delegación de eventos: manejar cambios en checkboxes incluso si se reconstruye
  comboList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.checked) comboSeleccion.add(id);
      else comboSeleccion.delete(id);
      updateComboTotal();
    });
  });
}

// ACTUALIZAR TOTAL DEL COMBO CON DESCUENTO SI APLICA
function updateComboTotal() {
  let total = 0;
  comboSeleccion.forEach(id => {
    const prod = document.querySelector(`.producto[data-id='${id}']`);
    if (prod) {
      total += parseFloat(prod.dataset.precio);
    }
  });

  // Descuento 15% si combo tiene 3 o más productos
  if (comboSeleccion.size >= 3) {
    total *= 0.85;
  }
  const totalElem = document.getElementById('comboTotal');
  if (totalElem) totalElem.innerText = total.toFixed(2);
}

// RESPUESTAS SIMPLES DEL ASISTENTE
function responderPregunta(text) {
  if (text.includes('martillo')) return 'El martillo de acero es ideal para trabajos duros y duraderos.';
  if (text.includes('taladro')) return 'Nuestro taladro eléctrico tiene varias velocidades para trabajos precisos.';
  if (text.includes('herramientas')) return 'Puedes armar combos con descuento si seleccionas 3 o más productos.';
  if (text.includes('precio')) return 'Todos los precios están en quetzales (Q). ¡Consulta los detalles en cada producto!';
  return 'Lo siento, no entendí la pregunta. ¿Puedes reformularla?';
}

// ANIMACIÓN SCROLL REVEAL SIMPLE
function setupScrollReveal() {
  const items = document.querySelectorAll('.producto');

  function reveal() {
    const triggerBottom = window.innerHeight * 0.85;
    items.forEach(item => {
      const top = item.getBoundingClientRect().top;
      if (top < triggerBottom) {
        item.classList.add('visible');
      } else {
        item.classList.remove('visible');
      }
    });
  }

  window.addEventListener('scroll', reveal);
  reveal();
}

// PARTICULAS CHISPEANTES CON CANVAS
function setupParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particlesArray = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random();
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      this.alpha += (Math.random() - 0.5) * 0.05;
      if (this.alpha < 0) this.alpha = 0;
      if (this.alpha > 1) this.alpha = 1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#ffb300';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    particlesArray = [];
    for (let i = 0; i < 80; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

// INICIALIZACIÓN AL CARGAR LA PÁGINA
window.addEventListener('DOMContentLoaded', () => {
  buildComboList();
  setupAsistente();
  setupScrollReveal();
  setupParticles();
  updateCartBadge();

  // Restaurar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const button = document.getElementById('darkToggleIcon')?.closest('button');
    if (button) button.innerHTML = '<span id="darkToggleIcon">🌞</span> Modo nocturno';
  }

  // Si se filtran productos, reconstruir la lista de combos para mantener coherencia
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      buildComboList();
    });
  }
});
function setupAsistente() {
  const asistenteBtn = document.getElementById('asistenteBtn');
  const chat = document.getElementById('asistenteChat');
  const chatLog = document.getElementById('chatLog');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');

  if (!asistenteBtn || !chat || !chatLog || !userInput || !sendBtn) return;

  asistenteBtn.addEventListener('click', () => {
    chat.classList.toggle('oculto');
    chatLog.innerHTML += '<p><em>Asistente activo. Pregúntame algo sobre herramientas.</em></p>';
    chat.scrollTop = chat.scrollHeight;
    userInput.focus();
  });

  const sendMessage = () => {
    const userText = userInput.value.trim();
    if (!userText) return;

    chatLog.innerHTML += `<p><strong>Tú:</strong> ${userText}</p>`;
    userInput.value = '';
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      const respuesta = responderPregunta(userText.toLowerCase());
      chatLog.innerHTML += `<p><strong>Asistente:</strong> ${respuesta}</p>`;
      chat.scrollTop = chat.scrollHeight;
    }, 800);
  };

  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
}
function filtrarProductos() {
  const filtro = document.getElementById("searchInput").value.toLowerCase();
  const productosDOM = document.querySelectorAll(".producto");

  productosDOM.forEach(producto => {
    const nombre = producto.getAttribute("data-nombre").toLowerCase();
    const descripcion = producto.querySelector("p").textContent.toLowerCase();

    if (nombre.includes(filtro) || descripcion.includes(filtro)) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
}

 
