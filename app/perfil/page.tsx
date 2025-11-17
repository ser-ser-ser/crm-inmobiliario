'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hacerBackup } from '@/utils/backup';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  role: string;
  fechaRegistro: string;
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: 'residencial'
  });

  // Datos para cambiar contraseña
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });

  useEffect(() => {
    console.log('🛠️ DEBUG INICIADO');
  console.log('userEmail:', localStorage.getItem('userEmail'));
  console.log('userName:', localStorage.getItem('userName'));
  console.log('userRole:', localStorage.getItem('userRole'));
  console.log('usuariosRegistrados:', JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]'));
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const nombre = localStorage.getItem('userName');
      const role = localStorage.getItem('userRole');

      if (!email) {
        router.push('/login');
        return;
      }
console.log('🔍 Buscando usuario con email:', email);
    
    // Si es un usuario predefinido (superadmin, admin, etc.), crearlo automáticamente
    const usuariosPredefinidos = [
      'superadmin@inmobiliaria.com',
      'admin@inmobiliaria.com', 
      'admin2@inmobiliaria.com',
      'carlos@inmobiliaria.com',
      'ana@inmobiliaria.com',
      'miguel@inmobiliaria.com'
    ];
    
    if (usuariosPredefinidos.includes(email)) {
      console.log('👤 Usuario predefinido detectado, creando perfil...');
      const usuarioPredefinido = {
        id: 'predefinido-' + Date.now(),
        nombre: nombre || 'Usuario',
        email: email,
        telefono: '+52 55 0000 0000',
        especialidad: 'residencial',
        role: role || 'broker',
        fechaRegistro: new Date().toISOString()
      };
      
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      // Solo agregar si no existe
      if (!usuariosRegistrados.find((u: any) => u.email === email)) {
        usuariosRegistrados.push(usuarioPredefinido);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        console.log('✅ Usuario predefinido creado:', usuarioPredefinido);
      }
    }
      // Buscar usuario en registrados
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      const usuarioEncontrado = usuariosRegistrados.find((u: any) => u.email === email);

      if (usuarioEncontrado) {
        setUsuario(usuarioEncontrado);
        setFormData({
          nombre: usuarioEncontrado.nombre,
          email: usuarioEncontrado.email,
          telefono: usuarioEncontrado.telefono || '',
          especialidad: usuarioEncontrado.especialidad || 'residencial'
        });
      } else {
        // Si no está en registrados, crear objeto básico
        const usuarioBasico: Usuario = {
          id: 'temp-' + Date.now(),
          nombre: nombre || 'Usuario',
          email: email,
          telefono: '',
          especialidad: 'residencial',
          role: role || 'broker',
          fechaRegistro: new Date().toISOString()
        };
        setUsuario(usuarioBasico);
        setFormData({
          nombre: nombre || 'Usuario',
          email: email,
          telefono: '',
          especialidad: 'residencial'
        });
      }

    } catch (error) {
      console.error('Error cargando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      // Actualizar en localStorage
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      
      let usuariosActualizados;
      if (usuario && usuariosRegistrados.some((u: any) => u.email === usuario.email)) {
        // Actualizar usuario existente
        usuariosActualizados = usuariosRegistrados.map((u: any) =>
          u.email === usuario.email ? { ...u, ...formData } : u
        );
      } else {
        // Agregar nuevo usuario
        const nuevoUsuario = {
          id: usuario?.id || 'temp-' + Date.now(),
          ...formData,
          role: usuario?.role || 'broker',
          fechaRegistro: usuario?.fechaRegistro || new Date().toISOString(),
          password: 'temp-password' // En un sistema real, mantener la password existente
        };
        usuariosActualizados = [...usuariosRegistrados, nuevoUsuario];
      }

      localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosActualizados));

      // Actualizar datos en localStorage de sesión
      localStorage.setItem('userName', formData.nombre);
      localStorage.setItem('userEmail', formData.email);

      // Hacer backup
      hacerBackup();

      setEditando(false);
      await cargarUsuario(); // Recargar datos
      
      alert('✅ Perfil actualizado exitosamente');

    } catch (error) {
      console.error('Error guardando perfil:', error);
      alert('❌ Error al actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    // Validaciones
    if (passwordData.nuevaPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      setGuardando(false);
      return;
    }

    if (passwordData.nuevaPassword !== passwordData.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      setGuardando(false);
      return;
    }

    try {
      // En un sistema real, aquí verificaríamos la contraseña actual
      // Por ahora, simulamos que es correcta
      const passwordActualCorrecta = true;

      if (!passwordActualCorrecta) {
        alert('La contraseña actual no es correcta');
        setGuardando(false);
        return;
      }

      // Actualizar contraseña en usuarios registrados
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      const usuariosActualizados = usuariosRegistrados.map((u: any) =>
        u.email === usuario?.email ? { ...u, password: passwordData.nuevaPassword } : u
      );

      localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosActualizados));

      // Hacer backup
      hacerBackup();

      setCambiandoPassword(false);
      setPasswordData({ passwordActual: '', nuevaPassword: '', confirmarPassword: '' });
      
      alert('✅ Contraseña actualizada exitosamente');

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      alert('❌ Error al cambiar la contraseña');
    } finally {
      setGuardando(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px' }}>
              👤 Mi Perfil
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Gestiona tu información personal y seguridad
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link
              href="/dashboard"
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              ← Volver al Dashboard
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Información del Perfil */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ color: '#374151', fontSize: '1.5rem' }}>Información Personal</h2>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#181f42',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {editando ? (
              <form onSubmit={guardarPerfil}>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
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
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="+52 55 1234 5678"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Especialidad
                    </label>
                    <select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
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

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setEditando(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={guardando}
                      style={{
                        padding: '10px 20px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: guardando ? 'not-allowed' : 'pointer',
                        opacity: guardando ? 0.7 : 1
                      }}
                    >
                      {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Nombre:</span>
                  <span>{usuario?.nombre}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Email:</span>
                  <span>{usuario?.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Teléfono:</span>
                  <span>{usuario?.telefono || 'No especificado'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Especialidad:</span>
                  <span>
                    {formData.especialidad === 'residencial' && '🏠 Residencial'}
                    {formData.especialidad === 'comercial' && '🛍️ Comercial'}
                    {formData.especialidad === 'industrial' && '🏭 Industrial'}
                    {formData.especialidad === 'mixto' && '🔀 Mixto'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Rol:</span>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    background: 
                      usuario?.role === 'superadmin' ? '#DC2626' : 
                      usuario?.role === 'admin' ? '#059669' : '#3B82F6',
                    color: 'white'
                  }}>
                    {usuario?.role}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Miembro desde:</span>
                  <span>{usuario?.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString() : 'Reciente'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Seguridad y Contraseña */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '25px' }}>🔒 Seguridad</h2>

            {cambiandoPassword ? (
              <form onSubmit={cambiarPassword}>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      name="passwordActual"
                      value={passwordData.passwordActual}
                      onChange={handlePasswordChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Tu contraseña actual"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="nuevaPassword"
                      value={passwordData.nuevaPassword}
                      onChange={handlePasswordChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmarPassword"
                      value={passwordData.confirmarPassword}
                      onChange={handlePasswordChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setCambiandoPassword(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={guardando}
                      style={{
                        padding: '10px 20px',
                        background: '#181f42',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: guardando ? 'not-allowed' : 'pointer',
                        opacity: guardando ? 0.7 : 1
                      }}
                    >
                      {guardando ? '⏳ Actualizando...' : '🔐 Cambiar Contraseña'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                  <h3 style={{ color: '#0369a1', marginBottom: '10px' }}>💡 Recomendaciones de Seguridad</h3>
                  <ul style={{ color: '#64748b', fontSize: '14px', paddingLeft: '20px' }}>
                    <li>Usa una contraseña con al menos 6 caracteres</li>
                    <li>Combina letras, números y símbolos</li>
                    <li>No uses la misma contraseña en múltiples sitios</li>
                    <li>Cambia tu contraseña regularmente</li>
                  </ul>
                </div>

                <button
                  onClick={() => setCambiandoPassword(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#181f42',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  🔑 Cambiar Mi Contraseña
                </button>

                <div style={{ padding: '15px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #f59e0b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#92400E' }}>
                    <span>ℹ️</span>
                    <div style={{ fontSize: '14px' }}>
                      <strong>¿Problemas con tu cuenta?</strong> Visita la página de <Link href="/recuperar-password" style={{ color: '#181f42', textDecoration: 'underline' }}>recuperación de contraseña</Link>.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}