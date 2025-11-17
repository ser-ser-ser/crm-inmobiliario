'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hacerBackup } from '@/utils/backup';

export default function RecuperarPasswordPage() {
  const [paso, setPaso] = useState(1); // 1: Email, 2: Preguntas, 3: Nueva contraseña
  const [email, setEmail] = useState('');
  const [respuestas, setRespuestas] = useState({ pregunta1: '', pregunta2: '' });
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<any>(null);
  const router = useRouter();

  // Preguntas de seguridad predefinidas
  const preguntasSeguridad = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿En qué ciudad naciste?",
    "¿Cuál es tu comida favorita?",
    "¿Nombre de tu mejor amigo de la infancia?",
    "¿Cuál es tu película favorita?"
  ];

  // Buscar usuario por email
  const buscarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Buscar en usuarios registrados
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      const usuario = usuariosRegistrados.find((u: any) => u.email === email);

      if (usuario) {
        setUsuarioEncontrado(usuario);
        setPaso(2);
      } else {
        alert('No se encontró ningún usuario con ese email.');
      }
    } catch (error) {
      console.error('Error buscando usuario:', error);
      alert('Error al buscar usuario.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar respuestas de seguridad
  const verificarRespuestas = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // En un sistema real, aquí verificaríamos las respuestas guardadas
      // Por ahora, simulamos que las respuestas son correctas
      const respuestasCorrectas = true; // Simulación

      if (respuestasCorrectas) {
        setPaso(3);
      } else {
        alert('Las respuestas no son correctas. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error verificando respuestas:', error);
      alert('Error al verificar las respuestas.');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const actualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (nuevaPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Actualizar en usuarios registrados
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      const usuariosActualizados = usuariosRegistrados.map((usuario: any) =>
        usuario.email === email ? { ...usuario, password: nuevaPassword } : usuario
      );

      localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosActualizados));

      // Hacer backup automático
      hacerBackup();

      alert('¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión.');
      router.push('/login');

    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      alert('Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
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
          <h1 style={{ color: '#181f42', marginBottom: '8px' }}>🔐 Recuperar Contraseña</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {paso === 1 && 'Ingresa tu email para recuperar tu cuenta'}
            {paso === 2 && 'Responde las preguntas de seguridad'}
            {paso === 3 && 'Crea tu nueva contraseña'}
          </p>
        </div>

        {/* Indicador de progreso */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            left: '0', 
            right: '0', 
            height: '2px', 
            background: '#e5e7eb',
            zIndex: 1 
          }}></div>
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            left: '0', 
            width: `${(paso - 1) * 50}%`, 
            height: '2px', 
            background: '#181f42',
            zIndex: 2,
            transition: 'width 0.3s ease'
          }}></div>
          {[1, 2, 3].map((num) => (
            <div key={num} style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              background: paso >= num ? '#181f42' : '#e5e7eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              zIndex: 3,
              position: 'relative'
            }}>
              {num}
            </div>
          ))}
        </div>

        {/* Paso 1: Ingresar Email */}
        {paso === 1 && (
          <form onSubmit={buscarUsuario}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                📧 Email de tu cuenta
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
                placeholder="tu@email.com"
              />
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
                  background: '#181f42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Buscando...' : '🔍 Buscar Cuenta'}
              </button>
            </div>
          </form>
        )}

        {/* Paso 2: Preguntas de Seguridad */}
        {paso === 2 && (
          <form onSubmit={verificarRespuestas}>
            <div style={{ marginBottom: '25px' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                Hola <strong>{usuarioEncontrado?.nombre}</strong>, responde tus preguntas de seguridad:
              </p>

              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    {preguntasSeguridad[0]}
                  </label>
                  <input
                    type="text"
                    value={respuestas.pregunta1}
                    onChange={(e) => setRespuestas({...respuestas, pregunta1: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                    placeholder="Tu respuesta..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    {preguntasSeguridad[1]}
                  </label>
                  <input
                    type="text"
                    value={respuestas.pregunta2}
                    onChange={(e) => setRespuestas({...respuestas, pregunta2: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                    placeholder="Tu respuesta..."
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setPaso(1)}
                style={{
                  padding: '12px 24px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#181f42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Verificando...' : '✅ Verificar Respuestas'}
              </button>
            </div>
          </form>
        )}

        {/* Paso 3: Nueva Contraseña */}
        {paso === 3 && (
          <form onSubmit={actualizarPassword}>
            <div style={{ marginBottom: '25px' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                ¡Respuestas correctas! Ahora crea tu nueva contraseña
              </p>

              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setPaso(2)}
                style={{
                  padding: '12px 24px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ← Volver
              </button>
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
                {loading ? '⏳ Actualizando...' : '🚀 Actualizar Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}