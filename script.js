/* ===========================
   CANVAS: ESTRELAS + CORAÇÕES
=========================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

// --- Estrelas ---
const STAR_COUNT  = 120;
const HEART_COUNT = 18;
let particles = [];

function heartPath(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, -0.3);
  ctx.bezierCurveTo(0.5, -1, 1.2, 0, 0, 0.9);
  ctx.bezierCurveTo(-1.2, 0, -0.5, -1, 0, -0.3);
  ctx.closePath();
  ctx.restore();
}

function randomBetween(a, b) { return a + Math.random() * (b - a); }

const STAR_COLORS  = ['#c084fc','#f472b6','#e879f9','#ffffff','#a855f7','#f9a8d4'];
const HEART_COLORS = ['rgba(244,114,182,', 'rgba(168,85,247,', 'rgba(232,121,249,'];

function initParticles() {
  particles = [];

  // Estrelas
  for (let i = 0; i < STAR_COUNT; i++) {
    const type = Math.random() < 0.4 ? 'sparkle' : 'dot'; // sparkle = forma de +
    particles.push({
      kind:    'star',
      type,
      x:       randomBetween(0, canvas.width),
      y:       randomBetween(0, canvas.height),
      size:    randomBetween(1, type === 'sparkle' ? 3.5 : 2),
      color:   STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      alpha:   randomBetween(0.2, 1),
      alphaDir: Math.random() < 0.5 ? 1 : -1,
      twinkleSpeed: randomBetween(0.003, 0.012),
      vy:      randomBetween(-0.08, -0.2),
    });
  }

  // Corações flutuantes
  for (let i = 0; i < HEART_COUNT; i++) {
    const baseColor = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    particles.push({
      kind:    'heart',
      x:       randomBetween(0, canvas.width),
      y:       randomBetween(canvas.height * 0.1, canvas.height),
      size:    randomBetween(4, 14),
      baseColor,
      alpha:   randomBetween(0.05, 0.25),
      alphaDir: Math.random() < 0.5 ? 1 : -1,
      twinkleSpeed: randomBetween(0.002, 0.008),
      vy:      randomBetween(-0.15, -0.4),
      vx:      randomBetween(-0.1, 0.1),
      rot:     randomBetween(-0.2, 0.2),
      rotSpeed: randomBetween(-0.005, 0.005),
    });
  }
}

function drawSparkle(x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth   = size * 0.4;
  ctx.lineCap     = 'round';
  // Cruz de 4 pontas finas
  ctx.beginPath();
  ctx.moveTo(x - size * 2, y); ctx.lineTo(x + size * 2, y);
  ctx.moveTo(x, y - size * 2); ctx.lineTo(x, y + size * 2);
  // Diagonais menores
  ctx.moveTo(x - size, y - size); ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size); ctx.lineTo(x - size, y + size);
  ctx.stroke();
  ctx.restore();
}

function drawDot(x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHeart(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  const s = p.size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(s * 1.1,  -s * 0.6,  s * 2.2, s * 0.4,   0, s * 1.8);
  ctx.bezierCurveTo(-s * 2.2, s * 0.4, -s * 1.1, -s * 0.6,   0, s * 0.3);
  ctx.closePath();

  const fill = ctx.createRadialGradient(0, s * 0.5, 0, 0, s * 0.5, s * 1.5);
  fill.addColorStop(0, p.baseColor + '0.9)');
  fill.addColorStop(1, p.baseColor + '0.1)');
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    // Twinkle
    p.alpha += p.twinkleSpeed * p.alphaDir;
    if (p.alpha >= (p.kind === 'heart' ? 0.28 : 1))  p.alphaDir = -1;
    if (p.alpha <= (p.kind === 'heart' ? 0.03 : 0.1)) p.alphaDir =  1;
    p.alpha = Math.max(0, p.alpha);

    if (p.kind === 'star') {
      p.y += p.vy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = randomBetween(0, canvas.width); }
      if (p.type === 'sparkle') drawSparkle(p.x, p.y, p.size, p.color, p.alpha);
      else                      drawDot(p.x, p.y, p.size, p.color, p.alpha);
    } else {
      p.y  += p.vy;
      p.x  += p.vx;
      p.rot += p.rotSpeed;
      if (p.y < -60) { p.y = canvas.height + 60; p.x = randomBetween(0, canvas.width); }
      if (p.x < -60)  p.x = canvas.width  + 60;
      if (p.x > canvas.width + 60) p.x = -60;
      drawHeart(p);
    }
  }

  requestAnimationFrame(animateCanvas);
}

initParticles();
animateCanvas();

/* ===========================
   BOTÃO ENTRAR + ANIMAÇÃO
=========================== */
const btnEnter        = document.getElementById('btn-enter');
const overlayAnim     = document.getElementById('overlay-anim');
const heroSection     = document.getElementById('hero');
const contadorSection = document.getElementById('contador-section');
const animHeartsWrap  = overlayAnim.querySelector('.anim-hearts');

function spawnOverlayHearts() {
  animHeartsWrap.innerHTML = '';
  const colors = ['#f472b6','#e879f9','#a855f7','#f9a8d4','#c084fc'];
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const size = 18 + Math.random() * 30;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 100 90');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size * 0.9);
      svg.classList.add('anim-heart-svg');
      svg.style.left = `${Math.random() * 100}%`;
      svg.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
      svg.style.animationDelay    = `${Math.random() * 0.4}s`;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d','M50 82 C48 80 8 56 8 30 C8 17 18 7 30 7 C38 7 45 12 50 20 C55 12 62 7 70 7 C82 7 92 17 92 30 C92 56 52 80 50 82 Z');
      path.setAttribute('fill', color);
      svg.appendChild(path);
      animHeartsWrap.appendChild(svg);
    }, i * 90);
  }
}

btnEnter.addEventListener('click', () => {
  overlayAnim.classList.remove('hidden');
  spawnOverlayHearts();

  setTimeout(() => {
    overlayAnim.style.opacity = '0';
    setTimeout(() => {
      overlayAnim.classList.add('hidden');
      overlayAnim.style.opacity = '1';

      heroSection.classList.remove('active');
      heroSection.classList.add('hidden');

      contadorSection.classList.remove('hidden');
      contadorSection.classList.add('visible');

      startCounter();
    }, 500);
  }, 2600);
});

/* ===========================
   CONTADOR EM TEMPO REAL
=========================== */
const dataInicio = new Date(2026, 1, 4, 21, 3, 0); // 4 fev 2026, 21:03

const elDias    = document.getElementById('dias');
const elHoras   = document.getElementById('horas');
const elMinutos = document.getElementById('minutos');
const elSegundos= document.getElementById('segundos');

function pad(n) { return String(n).padStart(2,'0'); }

function tick(el, val) {
  if (el.textContent !== val) {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    el.textContent = val;
    setTimeout(() => el.classList.remove('tick'), 200);
  }
}

function startCounter() {
  function update() {
    const diff = Date.now() - dataInicio.getTime();
    if (diff < 0) return;
    const s   = Math.floor(diff / 1000);
    tick(elDias,     pad(Math.floor(s / 86400)));
    tick(elHoras,    pad(Math.floor((s % 86400) / 3600)));
    tick(elMinutos,  pad(Math.floor((s % 3600) / 60)));
    tick(elSegundos, pad(s % 60));
  }
  update();
  setInterval(update, 1000);
}

/* ===========================
   REVELAR MÚSICA
=========================== */
const btnMusic  = document.getElementById('btn-music');
const musicCard = document.getElementById('music-card');

btnMusic.addEventListener('click', () => {
  btnMusic.style.opacity = '0';
  btnMusic.style.pointerEvents = 'none';
  musicCard.classList.remove('hidden');
});