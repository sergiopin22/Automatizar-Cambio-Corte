import React, { useEffect, useRef } from 'react';
import './LegalConfetti.css';

const LegalConfetti = ({ isActive }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Array para almacenar las partículas
    const particles = [];
    
    // Los colores de tu tema (rojo, blanco, azul)
    const colors = ['#cc0e1e', '#ffffff', '#3a69b9', '#f8d948']; // Rojo, blanco, azul, dorado

    // Clase para todas las partículas
    class Particle {
      constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type; // 'star', 'balance', 'gavel', 'document'
        this.color = color;
        this.size = Math.random() * 15 + 10; // Entre 10 y 25px
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = Math.random() * -15 - 5; // Velocidad inicial hacia arriba
        this.gravity = 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.opacity = 1;
        this.hasTriggeredEffect = false; // Para saber si ya se ha disparado un efecto especial
      }

      update() {
        // Aplicar física
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Reducir velocidad por resistencia del aire
        this.speedX *= 0.99;
        
        // Rotar el elemento
        this.rotation += this.rotationSpeed;
        
        // Desvanecer gradualmente
        if (this.y > canvas.height / 1.5) {
          this.opacity -= 0.01;
        }
        
        // Efecto especial para cada tipo cuando están cayendo y alcanzan una cierta velocidad
        if (!this.hasTriggeredEffect && this.speedY > 5) {
          if (this.type === 'gavel' && Math.random() > 0.7) {
            // Efecto destello para el mazo
            createFlash(this.x, this.y, this.color);
            this.hasTriggeredEffect = true;
          } else if (this.type === 'balance' && Math.random() > 0.8) {
            // Efecto de "pesaje" para las balanzas
            this.speedY = -this.speedY * 0.4; // Rebote
            this.hasTriggeredEffect = true;
          }
        }
        
        // Crear estela tras algunas partículas
        if (Math.random() > 0.9 && this.type === 'star' && this.opacity > 0.7) {
          createTrail(this.x, this.y, this.color, this.size / 3);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.type === 'star') {
          drawStar(0, 0, this.size, this.color);
        } else if (this.type === 'balance') {
          drawBalance(0, 0, this.size, this.color);
        } else if (this.type === 'gavel') {
          drawGavel(0, 0, this.size, this.color);
        } else if (this.type === 'document') {
          drawDocument(0, 0, this.size, this.color);
        }

        ctx.restore();
      }
    }

    // Función para dibujar una estrella
    function drawStar(x, y, size, color) {
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size / 2;

      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const pointX = x + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Función para dibujar una balanza de justicia simplificada
    function drawBalance(x, y, size, color) {
      const width = size * 1.5;
      const height = size;
      
      // Base/soporte
      ctx.beginPath();
      ctx.moveTo(x, y + height/2);
      ctx.lineTo(x - width/6, y + height);
      ctx.lineTo(x + width/6, y + height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      // Barra horizontal
      ctx.beginPath();
      ctx.rect(x - width/2, y, width, height/10);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Platos izquierdo y derecho
      ctx.beginPath();
      ctx.arc(x - width/3, y + height/4, size/4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x + width/3, y + height/4, size/4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Función para dibujar un mazo de juez simplificado
    function drawGavel(x, y, size, color) {
      const width = size * 1.5;
      const height = size;
      
      // Mango
      ctx.beginPath();
      ctx.rect(x - width/10, y - height/3, width/5, height);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Cabeza del mazo
      ctx.beginPath();
      ctx.roundRect(x - width/2, y - height/2, width, height/2.5, 5);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Función para dibujar un documento simplificado
    function drawDocument(x, y, size, color) {
      const width = size * 0.8;
      const height = size * 1.2;
      
      // Documento base
      ctx.beginPath();
      ctx.roundRect(x - width/2, y - height/2, width, height, 3);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Líneas de texto (3 líneas)
      const lineSpacing = height / 5;
      const lineWidth = width * 0.7;
      ctx.fillStyle = '#ffffff';
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.rect(x - lineWidth/2, y - height/3 + i * lineSpacing, lineWidth, height/15);
        ctx.fillStyle = (color === '#ffffff') ? '#dddddd' : '#ffffff';
        ctx.fill();
      }
    }

    // Función para crear un destello
    function createFlash(x, y, color) {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Función para crear estela detrás de partículas
    function createTrail(x, y, color, size) {
      const trail = {
        x,
        y,
        size,
        opacity: 0.7,
        color
      };
      
      trails.push(trail);
    }

    // Array para estelas
    const trails = [];

    // Función para generar la explosión inicial
    function generateExplosion() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const particleCount = 150; // Número total de partículas
      
      for (let i = 0; i < particleCount; i++) {
        // Determinar tipo de partícula
        let type;
        const typeRandom = Math.random();
        if (typeRandom < 0.55) {
          type = 'star'; // Mayoría estrellas (55%)
        } else if (typeRandom < 0.75) {
          type = 'balance'; // Balanzas (20%)
        } else if (typeRandom < 0.9) {
          type = 'gavel'; // Mazos (15%)
        } else {
          type = 'document'; // Documentos (10%)
        }
        
        // Color aleatorio
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Crear partícula
        const particle = new Particle(centerX, centerY, type, color);
        particles.push(particle);
      }
    }

    // Generar la explosión inicial
    generateExplosion();

    // Función de animación
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar estelas primero (detrás de las partículas)
      for (let i = 0; i < trails.length; i++) {
        const trail = trails[i];
        
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(trail.color.slice(1, 3), 16)}, ${parseInt(trail.color.slice(3, 5), 16)}, ${parseInt(trail.color.slice(5, 7), 16)}, ${trail.opacity})`;
        ctx.fill();
        
        // Reducir opacidad y eliminar si es muy transparente
        trail.opacity -= 0.02;
        if (trail.opacity <= 0) {
          trails.splice(i, 1);
          i--;
        }
      }
      
      // Actualizar y dibujar partículas
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Eliminar partículas si están fuera del canvas o son muy transparentes
        if (
          particles[i].y > canvas.height + particles[i].size ||
          particles[i].opacity <= 0
        ) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Añadir ocasionalmente nuevas partículas en la parte superior
      if (particles.length < 50 && Math.random() > 0.95) {
        const x = Math.random() * canvas.width;
        const y = -20;
        const type = ['star', 'balance', 'gavel', 'document'][Math.floor(Math.random() * 4)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const particle = new Particle(x, y, type, color);
        particle.speedY = Math.random() * 2 + 1; // Velocidad inicial hacia abajo
        particles.push(particle);
      }
      
      // Continuar animación si hay partículas
      if (particles.length > 0 || trails.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    
    // Iniciar animación
    animationRef.current = requestAnimationFrame(animate);
    
    // Limpiar al desmontar
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`legal-confetti ${isActive ? 'active' : ''}`}
    />
  );
};

export default LegalConfetti;