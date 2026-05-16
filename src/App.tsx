import { useState, useEffect } from 'react'
import './App.css'
import { Uploader } from './components/Uploader'
import { GalaxyAnalytics } from './components/GalaxyAnalytics'
import { parseWhatsAppExport, revokeMediaUrls } from './utils/whatsappParser'
import type { WhatsAppMessage } from './utils/whatsappParser'
import { analyzeChat } from './utils/analytics'
import type { ChatAnalytics } from './utils/analytics'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const springConfig = { type: "spring", stiffness: 100, damping: 20 } as const;

const NebulaLogo = ({ size = 100, showText = false }) => (
  <svg width={showText ? size * 3.8 : size} height={size} viewBox={showText ? "0 0 380 100" : "0 0 100 100"} xmlns="http://www.w3.org/2000/svg" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
    <defs>
      <radialGradient id="nebGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#00D4FF"/>
        <stop offset="45%" stopColor="#A855F7"/>
        <stop offset="100%" stopColor="#FF006E" stopOpacity="0.6"/>
      </radialGradient>
      <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor="#FFFFFF"/>
        <stop offset="60%" stopColor="#00D4FF"/>
        <stop offset="100%" stopColor="#7B2FBE"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softglow">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <g transform={showText ? "translate(8, 8)" : "translate(8, 8) scale(1.1)"}>
      <path d="M42 0 C18.8 0 0 16.4 0 36.6 C0 51.4 9.6 64.2 23.8 70.6 L18 84 L38 72.8 C39.3 72.9 40.6 73 42 73 C65.2 73 84 56.6 84 36.5 C84 16.4 65.2 0 42 0 Z"
            fill="url(#nebGrad)" opacity="0.15" filter="url(#softglow)"/>
      <path d="M42 0 C18.8 0 0 16.4 0 36.6 C0 51.4 9.6 64.2 23.8 70.6 L18 84 L38 72.8 C39.3 72.9 40.6 73 42 73 C65.2 73 84 56.6 84 36.5 C84 16.4 65.2 0 42 0 Z"
            fill="none" stroke="url(#nebGrad)" strokeWidth="1.5"/>

      <g className="orbit-ring">
        <ellipse cx="42" cy="37" rx="28" ry="10" fill="none" stroke="#00D4FF" strokeWidth="0.7" strokeOpacity="0.5" strokeDasharray="3 4"/>
      </g>

      <g className="orbit-ring-2">
        <ellipse cx="42" cy="37" rx="18" ry="28" fill="none" stroke="#A855F7" strokeWidth="0.7" strokeOpacity="0.4" strokeDasharray="2 5" transform="rotate(60 42 37)"/>
      </g>

      <path d="M42 37 Q55 25 62 20 Q68 16 65 22 Q60 30 42 37 Z" fill="#00D4FF" opacity="0.6" filter="url(#glow)"/>
      <path d="M42 37 Q28 50 22 56 Q18 62 23 58 Q30 50 42 37 Z" fill="#A855F7" opacity="0.5" filter="url(#glow)"/>
      <path d="M42 37 Q35 22 32 16 Q30 10 35 14 Q40 22 42 37 Z" fill="#FF006E" opacity="0.4" filter="url(#glow)"/>

      <circle cx="42" cy="37" r="5" fill="url(#coreGrad)" filter="url(#glow)"/>
      <circle cx="42" cy="37" r="2.5" fill="white" opacity="0.9"/>
    </g>

    {showText && (
      <>
        <text x="108" y="46"
              fontFamily="'Orbitron', monospace"
              fontSize="38"
              fontWeight="900"
              letterSpacing="6"
              fill="url(#nebGrad)"
              filter="url(#glow)">NEBULA</text>

        <text x="110" y="68"
              fontFamily="'Rajdhani', sans-serif"
              fontSize="11"
              fontWeight="300"
              letterSpacing="5"
              fill="rgba(232,240,255,0.4)">CONVERSATION ANALYZER</text>
      </>
    )}
  </svg>
);

function App() {
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const parsedMessages = await parseWhatsAppExport(file)
      if (parsedMessages.length === 0) {
        throw new Error("Aucun message n'a pu être extrait. Vérifiez que le format est bien un export WhatsApp.")
      }
      const stats = analyzeChat(parsedMessages)
      setMessages(parsedMessages)
      setAnalytics(stats)
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erreur lors du traitement.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    revokeMediaUrls(messages)
    setMessages([])
    setAnalytics(null)
    setError(null)
  }

  useEffect(() => {
    return () => revokeMediaUrls(messages)
  }, [messages])

  if (analytics) {
    return (
      <GalaxyAnalytics 
        stats={analytics} 
        onBack={handleBack} 
      />
    )
  }

  return (
    <div className="app-main" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="galaxy-icon" style={{ marginBottom: '32px' }}>
            <NebulaLogo size={120} showText={true} />
          </div>
          <p className="label-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto', letterSpacing: '0.15em' }}>
            TRANSFORMEZ VOS ÉCHANGES EN INSIGHTS COSMIQUES
          </p>
        </motion.div>
      </header>

      {isLoading ? (
        <div className="loading-state">
          <Loader2 size={40} className="animate-spin" />
          <p className="label-muted" style={{ marginTop: '16px', fontFamily: 'var(--mono)' }}>INITIALIZING_QUANTUM_PARSER...</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel" 
              style={{ 
                padding: '16px 24px', 
                borderColor: 'var(--nova)', 
                color: 'var(--nova)', 
                marginBottom: '24px',
                borderRadius: '16px',
                background: 'rgba(255, 0, 110, 0.05)',
                fontFamily: 'var(--heading)',
                fontSize: '12px'
              }}
            >
              <strong>ERROR:</strong> {error}
            </motion.div>
          )}
          <Uploader onUpload={handleUpload} />
        </div>
      )}
      
      <div className="stars-background" />
    </div>
  )
}

export default App
