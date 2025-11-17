'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { hacerBackup } from '@/utils/backup';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sistema de usuarios mejorado
  const users = [
    // Super Administrador
    { 
      email: 'superadmin@inmobiliaria.com', 
      password: 'superadmin123', 
      role: 'superadmin', 
      name: 'Super Administrador',
      permisos: ['todos']
    },
    // Administradores
    { 
      email: 'admin@inmobiliaria.com', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Administrador Principal',
      permisos: ['ver_todo', 'gestionar_usuarios', 'reportes']
    },
    { 
      email: 'admin2@inmobiliaria.com', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Administrador Secundario',
      permisos: ['ver_todo', 'reportes']
    },
    // Brokers
    { 
      email: 'carlos@inmobiliaria.com', 
      password: 'broker123', 
      role: 'broker', 
      name: 'Carlos Mendoza',
      permisos: ['mis_clientes', 'mis_propiedades']
    },
    { 
      email: 'ana@inmobiliaria.com', 
      password: 'broker123', 
      role: 'broker', 
      name: 'Ana Rodriguez', 
      permisos: ['mis_clientes', 'mis_propiedades']
    },
    { 
      email: 'miguel@inmobiliaria.com', 
      password: 'broker123', 
      role: 'broker', 
      name: 'Miguel Torres',
      permisos: ['mis_clientes', 'mis_propiedades']
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Guardar en localStorage
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userPermisos', JSON.stringify(user.permisos));
      
      console.log(`Login exitoso: ${user.name} (${user.role})`);
      router.push('/dashboard');
    } else {
      alert('Credenciales incorrectas. Revisa los usuarios de prueba abajo.');
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '450px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#181f42' }}>
          🔐 CRM Inmobiliario Pro
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#6b7280', fontSize: '14px' }}>
          Sistema de Gestión Inmobiliaria
        </p>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              placeholder="usuario@inmobiliaria.com"
            />
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              🔒 Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#181f42',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        {/* Panel de usuarios de prueba */}
        <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ marginBottom: '15px', color: '#374151', fontSize: '16px', textAlign: 'center' }}>
            👥 Usuarios de Prueba
          </h4>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            <div style={{ marginBottom: '8px', padding: '8px', background: '#fee2e2', borderRadius: '4px' }}>
              <strong>👑 Super Admin:</strong> superadmin@inmobiliaria.com / superadmin123
            </div>
            <div style={{ marginBottom: '8px', padding: '8px', background: '#dcfce7', borderRadius: '4px' }}>
              <strong>💼 Admin Principal:</strong> admin@inmobiliaria.com / admin123
            </div>
            <div style={{ marginBottom: '8px', padding: '8px', background: '#dcfce7', borderRadius: '4px' }}>
              <strong>💼 Admin Secundario:</strong> admin2@inmobiliaria.com / admin123
            </div>
            <div style={{ marginBottom: '4px', padding: '8px', background: '#dbeafe', borderRadius: '4px' }}>
              <strong>🤝 Brokers:</strong> 
            </div>
            <div style={{ marginBottom: '2px', paddingLeft: '15px' }}>carlos@inmobiliaria.com / broker123</div>
            <div style={{ marginBottom: '2px', paddingLeft: '15px' }}>ana@inmobiliaria.com / broker123</div>
            <div style={{ paddingLeft: '15px' }}>miguel@inmobiliaria.com / broker123</div>
          </div>
        </div>

        {/* Información de roles */}
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <details style={{ fontSize: '12px', color: '#6b7280' }}>
            <summary>ℹ️ Información de roles</summary>
            <div style={{ marginTop: '8px', textAlign: 'left' }}>
              <div><strong>👑 Super Admin:</strong> Acceso total al sistema</div>
              <div><strong>💼 Admin:</strong> Gestiona usuarios y ve todo</div>
              <div><strong>🤝 Broker:</strong> Solo ve sus clientes y propiedades</div>
            </div>
          </details>
        </div>

        {/* Link a registro */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            ¿Eres nuevo broker? {' '}
            <Link 
              href="/registro" 
              style={{ 
                color: '#181f42', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Crear cuenta aquí
            </Link>
          </p>
        </div>
 {/* Link a recuperación de contraseña */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            <Link 
              href="/recuperar-password" 
              style={{ 
                color: '#6b7280', 
                textDecoration: 'underline'
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}