'use client'

const steps = [
  {
    number: 1,
    title: 'Upload Your Image',
    description: 'Upload any photo you want to edit. Supports JPG, PNG, and WEBP formats. Works with portraits, landscapes, product photos, and old traditional film photos.',
  },
  {
    number: 2,
    title: 'Describe Your Edit in Plain English',
    description: 'Type exactly what you want to change. No design skills needed — just describe your edit naturally, like you\'d tell a friend.',
  },
  {
    number: 3,
    title: 'Generate and Download',
    description: 'Click Generate and your edited image is ready in seconds. Download it instantly in full quality.',
  },
]

const prompts = [
  'Change background to sunset',
  'Make it look like an oil painting',
  'Add dramatic lighting',
  'Turn day into night',
  'Remove the background',
  'Make it black and white cinematic',
]

const tools = [
  { name: 'Emoticons',     icon: '😃', desc: 'Custom emoji creation',         href: 'https://emoticons.deepvortexai.com' },
  { name: 'Image Gen',     icon: '🎨', desc: 'AI artwork & image generation',  href: 'https://images.deepvortexai.com' },
  { name: 'Logo Gen',      icon: '🛡️', desc: 'AI logo creation',             href: 'https://logo.deepvortexai.com' },
  { name: 'Avatar Gen',    icon: '🎭', desc: 'AI portrait styles',            href: 'https://avatar.deepvortexai.com' },
  { name: 'Remove BG',     icon: '✂️', desc: 'Remove backgrounds instantly',  href: 'https://bgremover.deepvortexai.com' },
  { name: 'Upscaler',      icon: '🔍', desc: 'Upscale images up to 4x',       href: 'https://upscaler.deepvortexai.com' },
  { name: 'Image → Video', icon: '🎬', desc: 'Animate images with AI',        href: 'https://video.deepvortexai.com' },
  { name: 'Deep Vortex Hub', icon: '🌀', desc: 'Explore the full AI ecosystem', href: 'https://deepvortexai.com' },
]

export default function HowToUsePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 1rem',
        position: 'relative',
      }}>
        <a
          href="/"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.5)',
            color: '#D4AF37',
            borderRadius: '8px',
            padding: '0.4rem 1rem',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← Back to Tool
        </a>

        <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <img
            src="/logotinyreal.webp"
            alt="Deep Vortex"
            style={{ height: '180px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(1.4rem, 4vw, 2.4rem)',
          fontWeight: 900,
          margin: '1rem 0 0.5rem',
          background: 'linear-gradient(135deg, #E8C87C 0%, #D4AF37 50%, #B8960C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px',
          textAlign: 'center',
          lineHeight: 1.3,
        }}>
          How to Use AI Image Editor
        </h1>

        <p style={{ color: '#D4AF37', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          ✏️ Edit any image with AI in seconds
        </p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

        {/* Steps */}
        <section style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  background: 'rgba(26,26,26,0.8)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E8C87C 0%, #D4AF37 50%, #B8960C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  color: '#0a0a0a',
                  boxShadow: '0 0 16px rgba(212,175,55,0.4)',
                }}>
                  {step.number}
                </div>

                <div>
                  <h2 style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#E8C87C',
                    margin: '0 0 0.5rem',
                    letterSpacing: '1px',
                  }}>
                    {step.title}
                  </h2>
                  <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Works With */}
        <section style={{
          marginTop: '2rem',
          background: 'rgba(212,175,55,0.06)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#D4AF37',
            letterSpacing: '2px',
            margin: '0 0 0.8rem',
            textTransform: 'uppercase',
          }}>
            🖼️ Works With
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {['Portraits', 'Landscapes', 'Product Photos', 'Old Traditional Film Photos'].map((type) => (
              <span key={type} style={{
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#E8C87C',
                borderRadius: '50px',
                padding: '0.35rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}>
                {type}
              </span>
            ))}
          </div>
        </section>

        {/* Example Prompts */}
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1rem',
            fontWeight: 800,
            color: '#D4AF37',
            letterSpacing: '2px',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}>
            ✨ Example Prompts
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}>
            {prompts.map((prompt) => (
              <div key={prompt} style={{
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '12px',
                padding: '0.85rem 1.1rem',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                fontStyle: 'italic',
              }}>
                "{prompt}"
              </div>
            ))}
          </div>
        </section>

        {/* Other Tools */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#D4AF37',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            Explore Our Other AI Tools
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1rem',
          }}>
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(26,26,26,0.8)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(212,175,55,0.6)'
                  el.style.background = 'rgba(212,175,55,0.08)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(212,175,55,0.2)'
                  el.style.background = 'rgba(26,26,26,0.8)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{tool.icon}</span>
                <span style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#E8C87C',
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                }}>
                  {tool.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.55)',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}>
                  {tool.desc}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #E8C87C 0%, #D4AF37 50%, #B8960C 100%)',
              color: '#0a0a0a',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '1px',
              padding: '0.85rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            }}
          >
            ✏️ Start Editing
          </a>
        </div>
      </main>
    </div>
  )
}
