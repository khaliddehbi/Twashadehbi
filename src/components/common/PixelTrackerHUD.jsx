import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Activity, X, CheckCircle, Database } from 'lucide-react';

export default function PixelTrackerHUD() {
  const { pixelsLog, showPixelHUD, setShowPixelHUD } = useStore();

  return (
    <div className="pixel-hud">
      {/* Toggle Button */}
      <button
        onClick={() => setShowPixelHUD(!showPixelHUD)}
        style={{
          background: 'var(--obsidian-900)',
          color: 'var(--gold-400)',
          border: '1px solid var(--border-gold)',
          borderRadius: '24px',
          padding: '8px 14px',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer'
        }}
        title="Meta Pixel & TikTok & GA4 Live Inspector"
      >
        <Activity size={14} color="#10B981" />
        <span>Pixel & Analytics HUD ({pixelsLog.length})</span>
      </button>

      {/* Slide-Up Inspector Card */}
      {showPixelHUD && (
        <div
          style={{
            position: 'absolute',
            bottom: '45px',
            left: '0',
            width: '360px',
            background: '#0B0C0E',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            color: '#E5E7EB',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
            zIndex: 100
          }}
        >
          {/* Header */}
          <div style={{ background: '#16181B', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={15} color="var(--gold-400)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--gold-300)' }}>
                Meta & TikTok Events Stream
              </span>
            </div>
            <button onClick={() => setShowPixelHUD(false)} style={{ color: '#9CA3AF' }}>
              <X size={16} />
            </button>
          </div>

          {/* Connected Pixels Status */}
          <div style={{ padding: '8px 16px', background: '#111315', display: 'flex', gap: '8px', fontSize: '0.72rem', borderBottom: '1px solid #1F2937' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
              <CheckCircle size={11} /> Meta Pixel Active
            </span>
            <span style={{ color: '#4B5563' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
              <CheckCircle size={11} /> TikTok Pixel Active
            </span>
            <span style={{ color: '#4B5563' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
              <CheckCircle size={11} /> GA4 Connected
            </span>
          </div>

          {/* Event Stream Log */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pixelsLog.map((ev) => (
              <div
                key={ev.id}
                style={{
                  background: '#15171A',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  borderLeft: '3px solid var(--gold-500)',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', color: '#6EE7B7' }}>
                    event: {ev.type}
                  </span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.68rem' }}>
                    {ev.time}
                  </span>
                </div>
                <div style={{ color: '#D1D5DB', fontFamily: 'monospace', fontSize: '0.7rem', wordBreak: 'break-all' }}>
                  {JSON.stringify(ev.data)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
