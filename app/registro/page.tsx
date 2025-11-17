// app/registro/page.tsx - FORMULARIO DE REGISTRO PARA BROKERS
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hacerBackup } from '@/utils/backup';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: 'residencial',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Guardar en localStorage (temporal)
      const nuevoUsuario = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        especialidad: formData.especialidad,
        role: 'broker',
        fechaRegistro: new Date().toISOString()
      };

      // Guardar en lista de usuarios registrados
      const usuariosExistentes = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      usuariosExistentes.push(nuevoUsuario);
      localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosExistentes));

      // También guardar credenciales de login
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.nombre);
      localStorage.setItem('userRole', 'broker');
      
      // HACER BACKUP AUTOMÁTICO
      hacerBackup();
      
      alert('¡Registro exitoso! Bienvenido/a ' + formData.nombre);
      router.push('/dashboard');

    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error en el registro. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        maxWidth: '500px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#181f42', marginBottom: '8px' }}>🤝 Unirse como Broker</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Crea tu cuenta para gestionar clientes y propiedades</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Información Personal */}
            <div>
              <h3 style={{ marginBottom: '15px', color: '#374151', fontSize: '16px' }}>Información Personal</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Especialidad *
                  </label>
                  <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="residencial">🏠 Residencial</option>
                    <option value="comercial">🛍️ Comercial</option>
                    <option value="industrial">🏭 Industrial</option>
                    <option value="mixto">🔀 Mixto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <h3 style={{ marginBottom: '15px', color: '#374151', fontSize: '16px' }}>Seguridad</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Contraseña *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 45px 12px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '32px',
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </div>
            </div>

            {/* Términos y Botones */}
            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
              Al registrarte, aceptas nuestros <Link href="/terminos" style={{ color: '#181f42' }}>Términos de Servicio</Link> y <Link href="/privacidad" style={{ color: '#181f42' }}>Política de Privacidad</Link>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link
                href="/login"
                style={{
                  padding: '12px 24px',
                  background: '#6b7280',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ← Volver a Login
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Creando cuenta...' : '🚀 Crear Cuenta'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}