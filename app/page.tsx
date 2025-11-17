import Link from 'next/link';

export default function Home() {
  return (
    
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #181f42ff 100%, #252730ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        
        <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3436', marginBottom: '16px' }}>
          CRM Inmobiliario Pro
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#636e72', marginBottom: '40px' }}>
          Sistema profesional de gestión inmobiliaria
        </p>
        <Link 
          href="/dashboard" 
          style={{
            display: 'inline-block',
            background: '#ff5a5f',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}
        >
          Ingresar al Sistema
        </Link>
      </div>
    </div>
  );
}