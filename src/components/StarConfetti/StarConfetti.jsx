import React, { useEffect, useRef } from 'react';
import './StarConfetti.css';

const StarConfetti = ({ isActive = false }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Limpiar estrellas existentes antes de crear nuevas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Crear estrellas de confeti
    const starCount = 75; // Aumentado el número de estrellas
    // Colores de tu marca (rojo, blanco, azul)
    const colors = ['#cc0e1e', '#ffffff', '#3a69b9', '#cc0e1e', '#ffffff']; // Añadí más rojos y blancos
    
    // Arreglo para almacenar todas las estrellas
    const stars = [];
    
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'confetti-star';
      
      // Tamaño aleatorio
      const size = Math.floor(Math.random() * 25) + 10; // Entre 10px y 35px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Posición inicial aleatoria (dispersa horizontalmente, todas desde arriba)
      const startX = Math.random() * containerWidth;
      const startY = -size - (Math.random() * containerHeight * 0.5); // Algunas empiezan más arriba
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      
      // Color aleatorio de la paleta
      const colorIndex = Math.floor(Math.random() * colors.length);
      star.style.backgroundColor = colors[colorIndex];
      
      // Rotación inicial aleatoria
      const rotation = Math.random() * 360;
      star.style.transform = `rotate(${rotation}deg)`;
      
      // Tamaño de fuente para velocidad (inversamente proporcional al tamaño)
      const speedFactor = 1 - (size - 10) / 25; // Valor entre 0 y 1
      
      // Animación con duración y retraso aleatorios
      const duration = (Math.random() * 2 + 3) * (0.8 + speedFactor * 0.4); // Entre 3 y 5 segundos, ajustado por tamaño
      const delay = Math.random() * 1.5; // Entre 0 y 1.5 segundos
      
      // Distancia horizontal aleatoria para movimiento en zig-zag
      const horizontalMovement = (Math.random() * 2 - 1) * 200; // Entre -200px y 200px
      
      // Personalizar la animación para cada estrella con keyframes
      const uniqueAnimation = `
        @keyframes starFall${stars.length} {
          0% {
            transform: translateY(0) translateX(0) rotate(${rotation}deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateY(${containerHeight * 0.25}px) translateX(${horizontalMovement * 0.3}px) rotate(${rotation + 90}deg);
          }
          50% {
            transform: translateY(${containerHeight * 0.5}px) translateX(${horizontalMovement * 0.7}px) rotate(${rotation + 180}deg);
          }
          75% {
            transform: translateY(${containerHeight * 0.75}px) translateX(${horizontalMovement}px) rotate(${rotation + 270}deg);
          }
          100% {
            transform: translateY(${containerHeight + size * 2}px) translateX(${horizontalMovement * 1.2}px) rotate(${rotation + 360}deg);
            opacity: 0;
          }
        }
      `;
      
      // Añadir el estilo personalizado para esta estrella
      const styleElement = document.createElement('style');
      styleElement.innerHTML = uniqueAnimation;
      document.head.appendChild(styleElement);
      
      star.style.animation = `starFall${stars.length} ${duration}s ease-out ${delay}s forwards`;
      
      // Añadir al contenedor
      container.appendChild(star);
      stars.push({ star, styleElement });
      
      // Limpiar las estrellas después de que termine la animación
      setTimeout(() => {
        if (container.contains(star)) {
          container.removeChild(star);
        }
        document.head.removeChild(styleElement);
      }, (duration + delay) * 1000 + 100);
    };
    
    // Crear estrellas con un ligero retraso entre ellas
    for (let i = 0; i < starCount; i++) {
      setTimeout(() => {
        if (isActive) { // Verificar que aún está activo
          createStar();
        }
      }, i * 50); // Espaciar la creación de estrellas para un efecto más natural
    }
    
    // Limpiar al desmontar
    return () => {
      // Eliminar todas las estrellas y estilos
      stars.forEach(({ star, styleElement }) => {
        if (container.contains(star)) {
          container.removeChild(star);
        }
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      });
    };
  }, [isActive]);
  
  return (
    <div ref={containerRef} className={`star-confetti-container ${isActive ? 'active' : ''}`}>
      {/* Las estrellas se generarán dinámicamente */}
    </div>
  );
};

export default StarConfetti;