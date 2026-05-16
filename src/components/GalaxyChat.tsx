import React, { useState, useRef, useCallback } from 'react';
import type { WhatsAppMessage } from '../utils/whatsappParser';
import { Image as ImageIcon, ArrowLeft, MessageSquare } from 'lucide-react';

interface GalaxyChatProps {
  messages: WhatsAppMessage[];
  onBack: () => void;
}

export const GalaxyChat: React.FC<GalaxyChatProps> = ({ messages, onBack }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollAccumulator = useRef(0);
  
  // Nombre de messages à afficher sur l'orbite (fenêtre glissante)
  const VISIBLE_COUNT = 12;
  const RADIUS = 280; // Rayon de l'orbite en pixels

  const handleWheel = useCallback((e: React.WheelEvent) => {
    scrollAccumulator.current += e.deltaY;
    
    // Sensibilité du scroll
    if (Math.abs(scrollAccumulator.current) > 50) {
      const direction = scrollAccumulator.current > 0 ? 1 : -1;
      setFocusedIndex(prev => {
        const next = prev + direction;
        return Math.max(0, Math.min(messages.length - 1, next));
      });
      scrollAccumulator.current = 0;
    }
  }, [messages.length]);

  // Messages à afficher : focus + voisins
  const visibleMessages = [];
  const half = Math.floor(VISIBLE_COUNT / 2);
  
  for (let i = -half; i <= half; i++) {
    const index = focusedIndex + i;
    if (index >= 0 && index < messages.length) {
      visibleMessages.push({ index, msg: messages[index], offset: i });
    }
  }

  const focusedMsg = messages[focusedIndex];
  const otherUser = messages[0]?.sender;

  return (
    <div className="galaxy-orbital-container" onWheel={handleWheel}>
      <header className="chat-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <div className="chat-info">
          <h2>{otherUser || "Conversation"}</h2>
          <span>Message {focusedIndex + 1} sur {messages.length}</span>
        </div>
      </header>

      <div className="orbital-system">
        {/* L'Orbite Visuelle */}
        <div className="orbit-path"></div>

        {/* Les Nœuds Orbitaux (Messages) */}
        {visibleMessages.map(({ index, msg, offset }) => {
          // Calcul de l'angle : le focus est à 270° (en haut) ou 90° (en bas) ?
          // Utilisons 90° (en bas) pour le focus et répartissons le reste
          const angle = (90 + (offset * (180 / VISIBLE_COUNT))) * (Math.PI / 180);
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          
          const isMe = msg.sender !== otherUser;
          const isFocus = index === focusedIndex;
          
          // Profondeur et opacité selon la distance au focus
          const distanceFactor = Math.abs(offset) / half;
          const opacity = 1 - distanceFactor * 0.7;
          const scale = isFocus ? 1.2 : 1 - distanceFactor * 0.3;

          return (
            <div 
              key={index}
              className={`orbital-node ${isMe ? 'me' : 'other'} ${isFocus ? 'focus' : ''}`}
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
                opacity: opacity,
                zIndex: isFocus ? 100 : 50 - Math.abs(offset)
              }}
              onClick={() => setFocusedIndex(index)}
            >
              <div className="node-dot">
                {msg.mediaUrl && <ImageIcon size={12} />}
              </div>
            </div>
          );
        })}

        {/* Le Centre Focal (Message Actif) */}
        <div className="central-focus">
          <div className="glass-card">
            <div className="card-header">
              <span className={`sender-tag ${focusedMsg.sender !== otherUser ? 'me' : 'other'}`}>
                {focusedMsg.sender}
              </span>
              <span className="timestamp">{focusedMsg.date} à {focusedMsg.time}</span>
            </div>
            
            <div className="card-content">
              {focusedMsg.mediaUrl ? (
                <div className="focus-media">
                  {focusedMsg.mediaName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={focusedMsg.mediaUrl} alt={focusedMsg.mediaName} />
                  ) : (
                    <div className="file-dl">
                      <ImageIcon size={48} />
                      <p>{focusedMsg.mediaName}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="focus-text">{focusedMsg.content}</p>
              )}
            </div>
            
            <div className="card-footer">
              <MessageSquare size={16} />
              <span>Faites rouler la molette pour voyager dans le temps</span>
            </div>
          </div>
          
          {/* Effets de glow du centre */}
          <div className={`center-glow ${focusedMsg.sender !== otherUser ? 'me' : 'other'}`}></div>
        </div>
      </div>

      <div className="stars-background"></div>
    </div>
  );
};
