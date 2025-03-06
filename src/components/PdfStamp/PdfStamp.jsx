import React from 'react';
import './PdfStamp.css';

const PdfStamp = () => {
  return (
    <div className="pdf-stamp">
      <div className="pdf-stamp-inner">
        <div className="stamp-star">
          <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff3a3a" />
                <stop offset="100%" stopColor="#cc0e1e" />
              </linearGradient>
              <filter id="starGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path d="M25 0 L31.7 17.2 L50 19.9 L37.5 33.2 L40.5 50 L25 42.1 L9.5 50 L12.5 33.2 L0 19.9 L18.3 17.2 Z" fill="url(#starGradient)" filter="url(#starGlow)" />
          </svg>
        </div>
        <div className="stamp-text">PRO TRAMITES</div>
        <div className="stamp-border"></div>
      </div>
    </div>
  );
};

export default PdfStamp;