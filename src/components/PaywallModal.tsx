import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Zap, Sparkles, Loader2, X, Activity, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface PaywallModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onSuccess, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 40 }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', y: 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="shell-outer"
        style={{ width: 'min(95vw, 900px)', padding: '10px' }}
      >
        <div className="core-inner" style={{ padding: 0, display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', overflow: 'hidden' }}>
          {/* Section Offre */}
          <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', padding: 'clamp(24px, 5vw, 56px)', borderRight: window.innerWidth < 768 ? 'none' : '1px solid var(--border-hairline)', borderBottom: window.innerWidth < 768 ? '1px solid var(--border-hairline)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <Sparkles className="accent-primary" size={20} />
              <span className="label-muted" style={{ fontWeight: 800, letterSpacing: '0.2em' }}>NEBULA PRO</span>
            </div>
            
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '16px', lineHeight: 1 }}>Accès Illimité</h2>
            <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, marginBottom: '8px', color: 'white' }}>1.00€ <span style={{ fontSize: '14px', opacity: 0.4, fontWeight: 400 }}>/ semaine</span></div>
            <p style={{ color: 'var(--starlight)', opacity: 0.6, marginBottom: '40px', fontSize: '15px' }}>Libérez la puissance totale de l'analyse spatiale Nebula.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: Zap, text: "Vitesse de communication & Latence" },
                { icon: Activity, text: "Heatmaps & Analyse temporelle" },
                { icon: ImageIcon, text: "Spectroscopie des médias" },
                { icon: ShieldCheck, text: "Extraction de rapports (.json)" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}
                >
                  <item.icon size={18} style={{ color: 'var(--quasar)' }} />
                  <span style={{ opacity: 0.8 }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section Paiement */}
          <div style={{ flex: 1, padding: 'clamp(24px, 5vw, 56px)', position: 'relative', background: 'rgba(0,0,0,0.2)' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--nebula-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)' }}>
                  <ShieldCheck size={40} color="white" />
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Activation Réussie</h3>
                <p className="label-muted">Accès Pro initialisé avec succès.</p>
              </motion.div>
            ) : (
              <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <h3 style={{ fontSize: '14px', letterSpacing: '0.1em', opacity: 0.5, fontWeight: 800 }}>MÉTHODE DE PAIEMENT</h3>
                
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '10px', fontSize: '11px', fontWeight: 700, opacity: 0.4 }}>NUMÉRO DE CARTE</label>
                  <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.02)' }}>
                    <CreditCard size={18} opacity={0.3} />
                    <input type="text" placeholder="4242 4242 4242 4242" style={{ background: 'none', border: 'none', color: 'white', outline: 'none', flex: 1, fontFamily: 'var(--mono)', fontSize: '15px' }} required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '11px', fontWeight: 700, opacity: 0.4 }}>EXPIRATION</label>
                    <input type="text" placeholder="MM / YY" className="glass-panel" style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', fontFamily: 'var(--mono)', fontSize: '15px' }} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '11px', fontWeight: 700, opacity: 0.4 }}>CVC</label>
                    <input type="text" placeholder="123" className="glass-panel" style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none', fontFamily: 'var(--mono)', fontSize: '15px' }} required />
                  </div>
                </div>

                <motion.button 
                  disabled={status === 'processing'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="browse-btn" 
                  style={{ width: '100%', padding: '8px 8px 8px 32px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}
                >
                  {status === 'processing' ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span>PAYER 1.00€</span>
                      <div className="btn-icon-circle" style={{ background: '#000' }}><ArrowRight size={18} /></div>
                    </>
                  )}
                </motion.button>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.2, fontSize: '10px', fontWeight: 700 }}>
                  <ShieldCheck size={12} />
                  <span>TRANSACTION SÉCURISÉE VIA STRIPE PROTOCOL</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

