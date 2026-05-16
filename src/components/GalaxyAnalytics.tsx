import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatAnalytics } from '../utils/analytics';
import { 
  Clock, Smile, Zap, Image as ImageIcon, 
  ArrowLeft, Download, Calendar, Activity, Ghost, Sparkles,
  Lock, Unlock
} from 'lucide-react';
import { PaywallModal } from './PaywallModal';

interface GalaxyAnalyticsProps {
  stats: ChatAnalytics;
  onBack: () => void;
}

const CATEGORIES = [
  { id: 'recap', label: 'CHRONIQUE_GALAXY', icon: Sparkles, color: '#FFD700', secure: false },
  { id: 'summary', label: 'ÉTOILES_CENTRALES', icon: Activity, color: '#10b981', secure: true },
  { id: 'hours', label: 'ORBITE_TEMPORY', icon: Clock, color: '#3b82f6', secure: true },
  { id: 'weekly', label: 'ASTÉROÏDE_CHART', icon: Calendar, color: '#6366f1', secure: true },
  { id: 'emojis', label: 'NÉBULEUSE_MOOD', icon: Smile, color: '#f59e0b', secure: true },
  { id: 'response', label: 'VITESSE_LUMIÈRE', icon: Zap, color: '#ef4444', secure: true },
  { id: 'media', label: 'AMAS_DE_DONNÉES', icon: ImageIcon, color: '#8b5cf6', secure: true },
  { id: 'deleted', label: 'TROUS_NOIRS', icon: Ghost, color: '#71717a', secure: true },
  { id: 'export', label: 'LOG_SUPERNOVA', icon: Download, color: '#fafafa', secure: true },
];

const springConfig = { type: "spring", stiffness: 100, damping: 20 } as const;

export const GalaxyAnalytics: React.FC<GalaxyAnalyticsProps> = ({ stats, onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const scrollAccumulator = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const RADIUS = Math.min(windowSize.width * 0.35, 380);

  const handleWheel = (e: React.WheelEvent) => {
    scrollAccumulator.current += e.deltaY;
    if (Math.abs(scrollAccumulator.current) > 120) {
      const direction = scrollAccumulator.current > 0 ? 1 : -1;
      setActiveTab(prev => {
        let next = prev + direction;
        if (next < 0) next = CATEGORIES.length - 1;
        if (next >= CATEGORIES.length) next = 0;
        if (isLocked && CATEGORIES[next].secure) return 0;
        return next;
      });
      scrollAccumulator.current = 0;
    }
  };

  const handleCategoryClick = (index: number) => {
    if (isLocked && CATEGORIES[index].secure) {
      setShowPaywall(true);
      return;
    }
    setActiveTab(index);
  };

  const handleUnlockSuccess = () => {
    setIsLocked(false);
    setShowPaywall(false);
  };

  const handleDownload = () => {
    if (isLocked) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `rapport_galaxy_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const renderActiveCard = () => {
    const category = CATEGORIES[activeTab];
    
    if (isLocked && category.secure) {
      return (
        <motion.div 
          key="locked"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel analytics-card"
          style={{ padding: '48px', minHeight: '550px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <Lock size={64} className="animate-pulse" style={{ color: '#ef4444', marginBottom: '24px' }} />
          <h2>Accès Verrouillé</h2>
          <p className="label-muted" style={{ marginTop: '16px', marginBottom: '32px', textAlign: 'center' }}>
            Veuillez déverrouiller le système Nebula Pro pour accéder à ces analyses.
          </p>
          <button onClick={() => setShowPaywall(true)} className="browse-btn">
            Débloquer Nebula Pro — 1€
          </button>
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        key={category.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel analytics-card"
        style={{ padding: '48px', width: '850px', minHeight: '550px' }}
      >
        {(() => {
          switch (category.id) {
            case 'recap':
              return (
                <div className="recap-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <span className="label-muted">Chronique de Mission</span>
                      <h2 style={{ fontSize: '32px', marginTop: '8px', background: 'var(--insta-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Briefing Galactique</h2>
                    </div>
                    <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: '12px', textAlign: 'right', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                      <span className="label-muted">Rang</span>
                      <div style={{ fontWeight: 700, color: '#FFD700' }}>{stats.activityProfile}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '20px', lineHeight: 1.6, color: '#e4e4e7', marginBottom: '40px' }}>
                    Votre voyage a débuté le <strong>{stats.firstMessage}</strong>. Depuis, un total de <strong>{stats.totalMessages.toLocaleString()}</strong> signaux ont été échangés, totalisant plus de <strong>{stats.totalWords.toLocaleString()}</strong> mots à travers la galaxie. 
                    Le signal le plus fort a été détecté le <strong>{stats.mostActiveDate.date}</strong> avec <strong>{stats.mostActiveDate.count}</strong> transmissions. 
                    Vous maintenez une série ininterrompue de <strong>{stats.longestStreak} jours</strong> de communication.
                  </p>
                  <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto' }}>
                    <div className="bento-item"><span className="label-muted">Pilote Principal</span><div className="val-sub" style={{ color: 'var(--accent-primary)' }}>{stats.topParticipant}</div></div>
                    <div className="bento-item"><span className="label-muted">Ondes de Joie</span><div className="val-sub">{stats.participants.reduce((a, b) => a + b.laughCount, 0).toLocaleString()} rires</div></div>
                    <div className="bento-item"><span className="label-muted">Données Extraites</span><div className="val-sub">{stats.totalMedia} unités</div></div>
                  </div>
                </div>
              );
            case 'summary':
              return (
                <div className="bento-grid">
                  <div className="bento-item bento-2x2">
                    <span className="label-muted">Volume Total</span>
                    <div className="val-hero">{stats.totalMessages.toLocaleString()}</div>
                    <div className="label-muted" style={{ marginTop: 'auto' }}>Active: {stats.firstMessage} — {stats.lastMessage}</div>
                  </div>
                  {stats.participants.map((p) => (
                    <div key={p.name} className="bento-item">
                      <span className="label-muted">{p.name}</span>
                      <div className="val-sub">{p.count.toLocaleString()} msg</div>
                    </div>
                  ))}
                </div>
              );
            case 'hours': {
              const maxHour = Math.max(...stats.hourlyActivity);
              return (
                <div className="hourly-chart" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="label-muted" style={{ marginBottom: '40px' }}>Densité Circadienne</div>
                  <div className="grid-heatmap" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', flex: 1 }}>
                    {stats.hourlyActivity.map((count, h) => (
                      <div key={h} className="heatmap-cell glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: `rgba(59, 130, 246, ${Math.max(0.05, (count / maxHour) * 0.4)})` }}>
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>{h}h</span>
                        <span style={{ fontWeight: 700 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            case 'weekly': {
              const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
              const maxDay = Math.max(...stats.weeklyActivity);
              return (
                <div className="weekly-chart" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="label-muted" style={{ marginBottom: '40px' }}>Résonance Hebdomadaire</div>
                  <div className="radial-activity" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {stats.weeklyActivity.map((count, d) => {
                      const angle = (d * (360 / 7) - 90) * (Math.PI / 180);
                      const x = Math.cos(angle) * 120;
                      const y = Math.sin(angle) * 120;
                      const size = 40 + (count / maxDay) * 60;
                      return (
                        <div key={d} style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, #6366f1, transparent)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800 }}>{days[d]}</span>
                          <span style={{ fontSize: '12px' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            case 'emojis':
              return (
                <div className="emoji-section">
                  <div className="label-muted" style={{ marginBottom: '32px' }}>Fréquence Émotionnelle</div>
                  <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {stats.topEmojis.map((item, i) => (
                      <div key={i} className="bento-item" style={{ alignItems: 'center' }}>
                        <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                        <span className="val-sub">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'response':
              return (
                <div className="velocity-section">
                  <div className="label-muted" style={{ marginBottom: '32px' }}>Latence des Interactions</div>
                  <div className="bento-grid">
                    {stats.participants.map(p => (
                      <div key={p.name} className="bento-item bento-2x1" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <span className="label-muted">{p.name}</span>
                          <div className="val-hero" style={{ fontSize: '48px' }}>{formatTime(p.avgResponseTime)}</div>
                        </div>
                        <Zap size={48} opacity={0.2} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'media':
              return (
                <div className="asset-section">
                  <div className="label-muted" style={{ marginBottom: '32px' }}>Analyse Spectrale des Échanges</div>
                  <div className="bento-grid">
                    {[
                      { label: 'Photos', val: stats.totalPhotos, icon: ImageIcon, color: '139, 92, 246' },
                      { label: 'Vidéos', val: stats.totalVideos, icon: Activity, color: '239, 68, 68' },
                      { label: 'Audios', val: stats.totalAudios, icon: Clock, color: '59, 130, 246' },
                      { label: 'Liens', val: stats.totalLinks, icon: Download, color: '245, 158, 11' },
                    ].map((m, i) => (
                      <div key={i} className="bento-item" style={{ background: `rgba(${m.color}, 0.1)` }}>
                        <span className="label-muted">{m.label}</span>
                        <div className="val-sub">{m.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '24px' }} className="glass-panel">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left' }}>
                          <th style={{ padding: '12px' }} className="label-muted">Pilote</th>
                          <th style={{ padding: '12px' }}>📷</th><th style={{ padding: '12px' }}>🎥</th><th style={{ padding: '12px' }}>🎙️</th><th style={{ padding: '12px' }}>🔗</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.participants.map(p => (
                          <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                            <td>{p.photoCount}</td><td>{p.videoCount}</td><td>{p.audioCount}</td><td>{p.linkCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            case 'deleted':
              return (
                <div className="void-section" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <Ghost size={80} style={{ margin: '0 auto 32px', opacity: 0.2 }} />
                  <div className="val-hero">{stats.totalDeleted}</div>
                  <div className="label-muted">Données définitivement perdues dans le néant</div>
                </div>
              );
            case 'export':
              return (
                <div className="export-section" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <Download size={80} style={{ margin: '0 auto 32px', opacity: 0.2 }} />
                  <h2 style={{ marginBottom: '16px' }}>Extraction de Données Prête</h2>
                  <button onClick={handleDownload} className="browse-btn" style={{ margin: '0 auto' }}>Générer le Rapport (.json)</button>
                </div>
              );
            default:
              return null;
          }
        })()}
      </motion.div>
    );
  };

  return (
    <div className="galaxy-orbital-container" onWheel={handleWheel}>
      <AnimatePresence>
        {showPaywall && <PaywallModal onSuccess={handleUnlockSuccess} onClose={() => setShowPaywall(false)} />}
      </AnimatePresence>

      <header className="chat-header" style={{ padding: '32px 48px', border: 'none', background: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <motion.button onClick={onBack} whileHover={{ scale: 1.1, x: -5 }} className="back-button-premium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px', borderRadius: '50%', color: 'var(--starlight)', position: 'relative', overflow: 'hidden' }}>
            <div className="back-glow" /><ArrowLeft size={22} style={{ position: 'relative', zIndex: 2 }} />
          </motion.button>
          <div className="chat-info" style={{ marginLeft: '24px' }}>
            <h2 style={{ fontSize: '14px', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>Système.Analytique</h2>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{CATEGORIES[activeTab].label.split('_')[0]}</div>
          </div>
        </div>

        <motion.button 
          onClick={() => isLocked ? setShowPaywall(true) : setIsLocked(true)}
          animate={{ boxShadow: isLocked ? ["0 0 0px #ef4444", "0 0 20px #ef4444", "0 0 0px #ef4444"] : ["0 0 0px #10b981", "0 0 20px #10b981", "0 0 0px #10b981"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: isLocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${isLocked ? '#ef4444' : '#10b981'}`, color: isLocked ? '#ef4444' : '#10b981', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '12px' }}
        >
          {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          {isLocked ? 'SYSTÈME_VERROUILLÉ' : 'SYSTÈME_PRÊT'}
        </motion.button>
      </header>

      <div className="orbital-system" style={{ perspective: '1200px' }}>
        <div className="orbit-path" />
        {CATEGORIES.map((cat, i) => {
          const offset = i - activeTab;
          let normalizedOffset = offset;
          if (normalizedOffset > CATEGORIES.length / 2) normalizedOffset -= CATEGORIES.length;
          if (normalizedOffset < -CATEGORIES.length / 2) normalizedOffset += CATEGORIES.length;

          const angle = (90 + (normalizedOffset * (360 / CATEGORIES.length))) * (Math.PI / 180);
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          const isActive = i === activeTab;
          const isCategoryLocked = isLocked && cat.secure;

          return (
            <motion.div 
              key={cat.id}
              className={`orbital-node ${isActive ? 'active' : ''}`}
              animate={{ x: `calc(-50% + ${x}px)`, y: `calc(-50% + ${y}px)`, scale: isActive ? 1.2 : 0.8, opacity: isCategoryLocked ? 0.1 : (isActive ? 1 : 0.2) }}
              transition={springConfig}
              style={{ position: 'absolute', zIndex: isActive ? 100 : 50, color: isCategoryLocked ? '#333' : cat.color, left: '50%', top: '50%', cursor: isCategoryLocked ? 'not-allowed' : 'pointer', filter: isCategoryLocked ? 'grayscale(1) blur(2px)' : 'none' }}
              onClick={() => handleCategoryClick(i)}
            >
              <div className="node-icon-wrapper">{isCategoryLocked ? <Lock size={20} /> : <cat.icon size={28} />}</div>
              {isActive && <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="node-label">{isCategoryLocked ? 'RESTREINT' : cat.label}</motion.span>}
            </motion.div>
          );
        })}

        <div className="central-focus">
          <AnimatePresence mode="wait">{renderActiveCard()}</AnimatePresence>
          <motion.div className="center-glow" animate={{ background: isLocked && CATEGORIES[activeTab].secure ? '#ef4444' : CATEGORIES[activeTab].color, opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 4, repeat: Infinity }} style={{ width: '600px', height: '600px', filter: 'blur(120px)', position: 'absolute', zIndex: -1 }} />
        </div>
      </div>
      <div className="stars-background" />
    </div>
  );
};
