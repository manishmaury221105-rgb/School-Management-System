import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

export const DeviceFrame = ({ deviceMode, children }) => {
  if (deviceMode === 'desktop') {
    return <div style={{ width: '100%', minHeight: '100%' }}>{children}</div>;
  }

  const isIphone = deviceMode === 'iphone';
  const isAndroid = deviceMode === 'android';
  const isTablet = deviceMode === 'tablet';

  const frameWidth = isTablet ? '820px' : isIphone ? '395px' : '412px';
  const frameHeight = isTablet ? '1080px' : isIphone ? '844px' : '880px';
  const borderRadius = isTablet ? '32px' : isIphone ? '50px' : '36px';

  return (
    <div className="device-frame-container">
      <div
        className="device-frame-phone"
        style={{
          width: frameWidth,
          height: frameHeight,
          borderRadius: borderRadius,
          border: isIphone ? '12px solid #1e293b' : isAndroid ? '10px solid #0f172a' : '14px solid #334155',
        }}
      >
        {/* iOS Dynamic Island */}
        {isIphone && (
          <div className="device-notch-island">
            <div className="device-notch-camera" />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#22c55e' }} />
          </div>
        )}

        {/* Android Punch Hole */}
        {isAndroid && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#000000',
            zIndex: 100,
            border: '1px solid #334155'
          }} />
        )}

        {/* Mobile Device Status Bar */}
        <div style={{
          height: isIphone ? '44px' : '34px',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          background: 'var(--bg-main)',
          zIndex: 30,
          borderBottom: '1px solid var(--border)',
          paddingTop: isIphone ? '6px' : '0'
        }}>
          <span>09:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} />
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* Scrollable Device Body */}
        <div className="device-scroll-body">
          {children}
        </div>

        {/* iOS Home Indicator Bar / Android Gesture Bar */}
        <div style={{
          height: '20px',
          background: 'var(--bg-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{
            width: isIphone ? '135px' : '90px',
            height: '4px',
            borderRadius: '3px',
            background: 'var(--text-muted)',
            opacity: 0.6
          }} />
        </div>
      </div>
    </div>
  );
};
