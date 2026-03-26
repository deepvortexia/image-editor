"use client";
import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import ImageDisplay from '../components/ImageDisplay';
import { Notification } from '../components/Notification';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

function WelcomeModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { title: 'Upload Your Image',    desc: 'JPG, PNG or WEBP — portraits, landscapes, product photos, even old film photos' },
    { title: 'Describe Your Edit',   desc: "Type in plain English: 'change background to forest', 'make it look like a painting', 'add dramatic lighting'" },
    { title: 'Download Your Result', desc: 'Your edited image is ready in seconds. Free to download and share' },
  ];
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111',
          border: '1px solid rgba(212,175,55,0.45)',
          borderRadius: '20px',
          padding: '2rem 2rem 1.75rem',
          maxWidth: '420px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 0 40px rgba(212,175,55,0.2)',
        }}
      >
        {/* Close X */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '50%', width: '32px', height: '32px',
            color: '#D4AF37', cursor: 'pointer', fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}
        >×</button>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #E8C87C 0%, #D4AF37 50%, #B8960C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 1.5rem',
          letterSpacing: '1px',
          lineHeight: 1.3,
          paddingRight: '2rem',
        }}>
          Welcome to AI Image Editor
        </h2>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                flexShrink: 0,
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #E8C87C 0%, #D4AF37 50%, #B8960C 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900, fontSize: '1rem', color: '#0a0a0a',
                boxShadow: '0 0 12px rgba(212,175,55,0.35)',
              }}>
                {i + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ color: '#E8C87C', fontSize: '0.95rem', fontWeight: 700 }}>{step.title}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.4 }}>{step.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #E8C87C 0%, #D4AF37 50%, #B8960C 100%)',
              border: 'none', borderRadius: '50px',
              color: '#0a0a0a', fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(212,175,55,0.35)',
            }}
          >
            Start Editing
          </button>
          <a
            href="/how-to-use"
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: '1px solid rgba(212,175,55,0.5)',
              borderRadius: '50px',
              color: '#D4AF37', fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px',
              cursor: 'pointer', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            How to Use
          </a>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const { refreshProfile } = useAuth();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);

  const [userPrompt, setUserPrompt]         = useState('');
  const [imageFile, setImageFile]           = useState<File | null>(null);
  const [imagePreview, setImagePreview]     = useState<string | null>(null);
  const [isDragging, setIsDragging]         = useState(false);
  const [isGenerating, setIsGenerating]     = useState(false);
  const [imageUrl, setImageUrl]             = useState<string | null>(null);
  const [error, setError]                   = useState<string | null>(null);
  const [toast, setToast]                   = useState<{ title: string; message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [buyPack, setBuyPack]               = useState<string | null>(null);
  const [loadingStage, setLoadingStage]     = useState<0 | 1 | 2 | 3>(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef        = useRef<HTMLInputElement>(null);
  const textareaRef         = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('editor-welcome-seen')) {
      setShowWelcome(true);
      localStorage.setItem('editor-welcome-seen', '1');
    }
  }, []);

  const refreshWithRetry = useCallback(async () => {
    await refreshProfile();
    setTimeout(async () => { await refreshProfile(); }, 2000);
    setTimeout(async () => { await refreshProfile(); }, 5000);
  }, [refreshProfile]);

  useEffect(() => {
    if (!searchParams) return;
    const success = searchParams.get('success');
    const buy = searchParams.get('buy');
    if (success === 'true') { refreshWithRetry(); window.history.replaceState({}, '', '/'); }
    if (buy) {
      const v = ['Starter', 'Basic', 'Popular', 'Pro', 'Ultimate'];
      if (v.includes(buy)) { setBuyPack(buy); window.history.replaceState({}, '', '/'); }
    }
  }, [searchParams, refreshWithRetry]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToast({ title: 'Invalid File', message: 'Please upload an image file (JPG, PNG, WebP, etc.)', type: 'error' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ title: 'File Too Large', message: 'Please upload an image smaller than 10MB.', type: 'error' });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      setToast({ title: 'Prompt Required', message: 'Please describe the edits you want to make.', type: 'warning' });
      return;
    }
    if (!imageFile) {
      setToast({ title: 'Image Required', message: 'Please upload an image to edit.', type: 'warning' });
      return;
    }

    const clearIntervals = () => {
      if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
      if (elapsedIntervalRef.current)  { clearInterval(elapsedIntervalRef.current);  elapsedIntervalRef.current  = null; }
    };

    setIsGenerating(true);
    setError(null);
    setToast(null);
    setImageUrl(null);
    setLoadingStage(1);
    setLoadingProgress(0);
    setElapsedSeconds(0);
    elapsedIntervalRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);

    try {
      setLoadingProgress(5);
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!s?.access_token) { setError('Please sign in.'); setIsGenerating(false); return; }

      // Read image as base64
      setLoadingProgress(10);
      setLoadingStage(2);
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip "data:image/...;base64," prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      progressIntervalRef.current = setInterval(() => {
        setLoadingProgress(prev => { const gap = 85 - prev; return gap < 0.05 ? prev : prev + gap * 0.003; });
      }, 100);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      let res: Response;
      try {
        res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + s.access_token,
          },
          body: JSON.stringify({
            prompt: userPrompt,
            imageBase64,
            imageMimeType: imageFile.type,
          }),
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        clearTimeout(timeout); clearIntervals();
        if (fetchErr.name === 'AbortError') {
          setToast({ title: 'Request Timed Out', message: 'The edit took too long. Please try again. No credits were deducted.', type: 'warning' });
        } else {
          setToast({ title: 'Network Error', message: 'Could not connect to the server. Please check your connection and try again. No credits were deducted.', type: 'error' });
        }
        return;
      }

      clearTimeout(timeout);
      if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        switch (res.status) {
          case 401: setToast({ title: 'Session Expired', message: 'Your session has expired. Please refresh the page and sign in again. No credits were deducted.', type: 'error' }); break;
          case 402: setToast({ title: 'Insufficient Credits', message: "You don't have enough credits. Image editing costs 2 credits. Purchase more to continue.", type: 'warning' }); setBuyPack('Starter'); break;
          case 429: setToast({ title: 'Too Many Requests', message: 'Please wait a moment before editing again. No credits were deducted.', type: 'warning' }); break;
          case 503: setToast({ title: 'Service Unavailable', message: 'The image editing service is temporarily unavailable. Please try again in a few minutes. No credits were deducted.', type: 'error' }); break;
          default:  setToast({ title: 'Edit Failed', message: (data.error || 'An unexpected error occurred') + '. No credits were deducted.', type: 'error' }); break;
        }
        return;
      }

      setLoadingStage(3);
      setLoadingProgress(85);
      await new Promise<void>(resolve => {
        let p = 85;
        const finalize = setInterval(() => {
          p += 3;
          setLoadingProgress(Math.min(p, 100));
          if (p >= 100) { clearInterval(finalize); resolve(); }
        }, 40);
      });

      const data = await res.json();
      setImageUrl(data.imageUrl);
      await refreshProfile();
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'deepvortex-credits-updated' }, 'https://deepvortexai.com');
      }
    } catch (err: unknown) {
      setToast({ title: 'Edit Failed', message: (err instanceof Error ? err.message : 'An unexpected error occurred') + '. No credits were deducted.', type: 'error' });
    } finally {
      clearIntervals();
      setIsGenerating(false);
      setLoadingStage(0);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="app min-h-screen bg-black text-white font-sans pb-10">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <Header buyPack={buyPack} onBuyPackHandled={() => setBuyPack(null)} />
      <div className="particles">
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((left, i) => (
          <div key={i} className="particle" style={{ left: `${left}%`, animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>

      <main className="max-w-[1200px] mx-auto px-3 sm:px-5 flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto mt-4 sm:mt-6">

          {/* ── Image Upload Area ── */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#D4AF37' : imagePreview ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.3)'}`,
              borderRadius: '16px',
              background: isDragging ? 'rgba(212,175,55,0.05)' : 'rgba(20,20,20,0.6)',
              minHeight: imagePreview ? 'auto' : '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: imagePreview ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block', borderRadius: '12px', padding: '8px' }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                  style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.4)',
                    borderRadius: '50%', width: '32px', height: '32px',
                    color: '#D4AF37', cursor: 'pointer', fontSize: '1.1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Remove image"
                >×</button>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  style={{
                    margin: '8px auto',
                    background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '8px', padding: '6px 16px',
                    color: '#D4AF37', cursor: 'pointer', fontSize: '0.82rem',
                  }}
                >↩ Change image</button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖼️</div>
                <p style={{ color: '#D4AF37', fontWeight: 600, marginBottom: '0.35rem', fontSize: '1rem' }}>
                  {isDragging ? 'Drop your image here' : 'Upload an image to edit'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
                  Drag & drop or click · JPG, PNG, WebP · max 10MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ''; }}
            />
          </div>

          {/* ── Prompt + Generate ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <textarea
              ref={textareaRef}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Describe the edits you want… e.g. 'make the sky pink at sunset', 'remove the background', 'add snow falling'"
              rows={3}
              disabled={isGenerating}
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '16px',
                lineHeight: '1.5',
                border: '2px solid rgba(212,175,55,0.3)',
                borderRadius: '12px',
                background: 'rgba(20,20,20,0.8)',
                color: '#fff',
                resize: 'vertical',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#D4AF37'; e.target.style.boxShadow = '0 0 20px rgba(212,175,55,0.3)'; }}
              onBlur={(e)  => { e.target.style.borderColor = 'rgba(212,175,55,0.3)'; e.target.style.boxShadow = 'none'; }}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt.trim() || !imageFile}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: isGenerating || !userPrompt.trim() || !imageFile
                  ? 'rgba(212,175,55,0.3)'
                  : 'linear-gradient(135deg, #B8860B, #D4AF37)',
                border: 'none',
                borderRadius: '12px',
                color: isGenerating || !userPrompt.trim() || !imageFile ? 'rgba(255,255,255,0.5)' : '#0a0a0a',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '1px',
                cursor: isGenerating || !userPrompt.trim() || !imageFile ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {isGenerating ? '✏️ Editing...' : '✏️ Edit Image — 2 Credits'}
            </button>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: 0 }}>
              Ctrl+Enter to generate · 2 credits per edit
            </p>
          </div>
        </div>

        {/* ── Loading Progress ── */}
        {isGenerating && (
          <div className="loading-section">
            <div className="progress-stages">
              <div className={`progress-stage${loadingStage === 1 ? ' stage-active' : loadingStage > 1 ? ' stage-done' : ''}`}>
                <div className="stage-dot" />
                <span>Reading your image...</span>
              </div>
              <div className={`progress-stage${loadingStage === 2 ? ' stage-active' : loadingStage > 2 ? ' stage-done' : ''}`}>
                <div className="stage-dot" />
                <span>AI is editing your image...</span>
              </div>
              <div className={`progress-stage${loadingStage === 3 ? ' stage-active' : ''}`}>
                <div className="stage-dot" />
                <span>Finalizing result...</span>
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${loadingProgress}%` }} />
              </div>
              {loadingProgress > 0 && (
                <div className="progress-bar-tip" style={{ left: `${loadingProgress}%` }} />
              )}
            </div>
            <div className="progress-footer">
              <span className="progress-percent">{Math.round(loadingProgress)}%</span>
              <span className="progress-elapsed">{elapsedSeconds}s...</span>
            </div>
          </div>
        )}

        <ImageDisplay
          imageUrl={imageUrl}
          isLoading={isGenerating}
          error={error}
          prompt={userPrompt}
          onRegenerate={handleGenerate}
        />

        <EcosystemCards />
      </main>

      <footer className="text-center py-14 mt-8 border-t border-[rgba(212,175,55,0.2)]">
        <a href="https://deepvortexai.com" className="block text-gray-400 hover:text-[#D4AF37] no-underline text-lg mb-6 transition-colors">
          Deep Vortex AI - Building the complete AI creative ecosystem
        </a>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <a href="https://www.tiktok.com/@deepvortexai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#D4AF37] no-underline text-base hover:opacity-75 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
            </svg>
            TikTok
          </a>
          <a href="https://x.com/deepvortexart" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#D4AF37] no-underline text-base hover:opacity-75 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </a>
          <a href="mailto:admin@deepvortexai.com" className="inline-block px-6 py-2.5 border border-[rgba(212,175,55,0.6)] rounded-lg bg-transparent text-[#D4AF37] no-underline text-base hover:bg-[rgba(212,175,55,0.1)] hover:border-[#D4AF37] transition-all">
            Contact Us
          </a>
        </div>
      </footer>

      <Notification
        show={!!toast}
        onClose={() => setToast(null)}
        title={toast?.title}
        message={toast?.message}
        type={toast?.type}
      />
      <a href="https://deepvortexai.com/game" target="_blank" rel="noopener noreferrer" className="play-earn-fab">
        ⚡ Play &amp; Earn
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
