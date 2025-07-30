import React from 'react';

function LandingPage({ onStart }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      {/* Logo/Icon */}
      <div style={{
        fontSize: '64px',
        marginBottom: '20px',
        animation: 'fadeInDown 1s ease-out'
      }}>
        🛡️
      </div>
      
      {/* Main Title */}
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '16px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 1s ease-out 0.2s both'
      }}>
        SmartGuard Exam Proctor
      </h1>
      
      {/* Subtitle */}
      <p style={{
        fontSize: '20px',
        marginBottom: '32px',
        opacity: 0.9,
        maxWidth: '600px',
        lineHeight: '1.6',
        animation: 'fadeInUp 1s ease-out 0.4s both'
      }}>
        Secure, AI-powered online examinations with advanced biometric authentication 
        and real-time anti-cheating detection.
      </p>
      
      {/* Features */}
      <div style={{
        display: 'flex',
        gap: '30px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        animation: 'fadeInUp 1s ease-out 0.6s both'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔐</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Multi-Biometric</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Face, Iris, Fingerprint</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>AI Monitoring</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Real-time Detection</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Live Dashboard</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Supervisor Alerts</div>
        </div>
      </div>
      
      {/* Start Button */}
      <button
        onClick={onStart}
        style={{
          padding: '16px 48px',
          fontSize: '20px',
          fontWeight: 'bold',
          borderRadius: '50px',
          border: 'none',
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          animation: 'fadeInUp 1s ease-out 0.8s both',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        }}
      >
        Start Secure Exam
      </button>
      
      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '12px',
        opacity: 0.7,
        animation: 'fadeIn 1s ease-out 1s both'
      }}>
        Powered by Advanced AI Technology • Secure & Reliable
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default LandingPage; 
