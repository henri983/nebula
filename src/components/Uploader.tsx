import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileArchive, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface UploaderProps {
  onUpload: (file: File) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    if (file.name.endsWith('.zip')) {
      setError(null);
      setPendingFile(file);
      setShowConsent(true);
    } else {
      setError("Extension invalide. Veuillez fournir une archive .zip.");
    }
  };

  const confirmUpload = () => {
    if (pendingFile) {
      onUpload(pendingFile);
      setShowConsent(false);
    }
  };

  return (
    <div className="uploader-container">
      <AnimatePresence>
        {showConsent && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 40 }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', y: 20 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.4 }
              }}
              className="shell-outer rgpd-modal"
            >
              <div className="core-inner" style={{ padding: 'clamp(24px, 5vw, 56px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--nebula-gradient)' }} />
                
                <h2 style={{ marginBottom: '24px', background: 'var(--nebula-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  Gouvernance des Données
                </h2>
                <p style={{ color: 'var(--starlight)', opacity: 0.8, marginBottom: '32px', fontSize: '15px', lineHeight: 1.6 }}>
                  Avant de procéder à l'analyse, veuillez confirmer votre accord avec notre protocole de confidentialité strict (Conformité RGPD) :
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                  {[
                    { title: "Traitement 100% Local", desc: "Vos discussions ne quittent jamais votre navigateur. Aucune donnée n'est transférée vers nos serveurs." },
                    { title: "Non-Persistance", desc: "Les données sont traitées en mémoire vive et détruites dès la fermeture de la session." },
                    { title: "Usage Statistique", desc: "Seules les métadonnées sont extraites pour le calcul, sans archivage du contenu." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      style={{ display: 'flex', gap: '16px' }}
                    >
                      <div style={{ padding: '4px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', height: 'fit-content' }}>
                        <CheckCircle2 size={18} style={{ color: 'var(--solar-blue)', flexShrink: 0 }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px', color: 'var(--starlight)' }}>{item.title}</div>
                        <div style={{ fontSize: '13px', opacity: 0.5, lineHeight: 1.4 }}>{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <motion.button 
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    className="cancel-btn" 
                    onClick={() => setShowConsent(false)}
                    style={{ padding: '16px 32px', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}
                  >
                    ANNULER LE VOYAGE
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="browse-btn" 
                    onClick={confirmUpload}
                    style={{ padding: '6px 6px 6px 32px', borderRadius: '100px', gap: '24px' }}
                  >
                    ACCEPTER & ANALYSER
                    <div className="btn-icon-circle" style={{ background: '#000', color: '#fff' }}><ArrowRight size={18} /></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shell-outer"
      >
        <div 
          className="core-inner drop-zone"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '100px 40px',
            textAlign: 'center'
          }}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
            <div className="icon-box" style={{ margin: 0, width: '100px', height: '100px', borderRadius: '30px' }}>
              <Upload size={40} />
            </div>
            
            <div style={{ maxWidth: '400px' }}>
              <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Prêt pour l'Analyse ?</h2>
              <p className="label-muted" style={{ fontSize: '15px', lineHeight: 1.5 }}>
                Glissez votre export <strong>.zip</strong> ici ou utilisez le bouton ci-dessous pour commencer le voyage.
              </p>
            </div>

            <input 
              type="file" 
              accept=".zip" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="file-input"
            />
            
            <label htmlFor="file-input" className="browse-btn" style={{ padding: '20px 48px' }}>
              SÉLECTIONNER L'ARCHIVE
              <div className="btn-icon-circle" style={{ marginLeft: '12px' }}><ArrowRight size={18} /></div>
            </label>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '32px', color: 'var(--nova)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 0, 110, 0.1)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 0, 110, 0.2)' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="uploader-info-grid">
        <div className="glass-panel" style={{ padding: '32px' }}>
          <FileArchive size={20} style={{ color: 'var(--nebula)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Format requis</h3>
          <p className="label-muted" style={{ fontSize: '13px', lineHeight: 1.5 }}>
            Exportez votre discussion depuis WhatsApp en choisissant "Joindre les médias". L'archive contiendra le texte et les fichiers.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--quasar)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Sécurité locale</h3>
          <p className="label-muted" style={{ fontSize: '13px', lineHeight: 1.5 }}>
            Le traitement s'effectue intégralement sur votre machine. Aucune donnée n'est envoyée vers un serveur.
          </p>
        </div>
      </div>
    </div>
  );
};
