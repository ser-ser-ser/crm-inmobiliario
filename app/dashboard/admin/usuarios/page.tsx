'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  role: string;
  fechaRegistro: string;
  activo: boolean;
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const router = useRouter();

  useEffect(() => {
    verificarPermisosYCargarUsuarios();
  }, [filtroRol]);

  const verificarPermisosYCargarUsuarios = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');
      
      if (!email || !role) {
        router.push('/login');
        return;
      }

      // Solo Super Admin y Admin pueden acceder
      if (role !== 'superadmin' && role !== 'admin') {
        alert('No tienes permisos para acceder a esta sección');
        router.push('/dashboard');
        return;
      }

      setUserRole(role);
      await cargarUsuarios();

    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      // 1. Usuarios registrados en el formulario (brokers)
      const usuariosRegistrados: Usuario[] = JSON.parse(
        localStorage.getItem('usuariosRegistrados') || '[]'
      );

      // 2. Usuarios predefinidos del sistema (admins)
      const usuariosPredefinidos: Usuario[] = [
        {
          id: 'superadmin-1',
          nombre: 'Super Administrador',
          email: 'superadmin@inmobiliaria.com',
          telefono: '+52 55 0000 0000',
          especialidad: 'Todos',
          role: 'superadmin',
          fechaRegistro: new Date().toISOString(),
          activo: true
        },
        {
          id: 'admin-1',
          nombre: 'Administrador Principal',
          email: 'admin@inmobiliaria.com',
          telefono: '+52 55 1111 2222',
          especialidad: 'Gestión',
          role: 'admin',
          fechaRegistro: new Date().toISOString(),
          activo: true
        },
        {
          id: 'admin-2',
          nombre: 'Administrador Secundario',
          email: 'admin2@inmobiliaria.com',
          telefono: '+52 55 3333 4444',
          especialidad: 'Gestión',
          role: 'admin',
          fechaRegistro: new Date().toISOString(),
          activo: true
        },
        {
          id: 'broker-1',
          nombre: 'Carlos Mendoza',
          email: 'carlos@inmobiliaria.com',
          telefono: '+52 55 5555 6666',
          especialidad: 'Residencial',
          role: 'broker',
          fechaRegistro: new Date().toISOString(),
          activo: true
        },
        {
          id: 'broker-2',
          nombre: 'Ana Rodriguez',
          email: 'ana@inmobiliaria.com',
          telefono: '+52 55 7777 8888',
          especialidad: 'Comercial',
          role: 'broker',
          fechaRegistro: new Date().toISOString(),
          activo: true
        },
        {
          id: 'broker-3',
          nombre: 'Miguel Torres',
          email: 'miguel@inmobiliaria.com',
          telefono: '+52 55 9999 0000',
          especialidad: 'Industrial',
          role: 'broker',
          fechaRegistro: new Date().toISOString(),
          activo: true
        }
      ];

      // Combinar todos los usuarios
      const todosUsuarios = [...usuariosPredefinidos, ...usuariosRegistrados];

      // Aplicar filtro
      let usuariosFiltrados = todosUsuarios;
      if (filtroRol !== 'todos') {
        usuariosFiltrados = todosUsuarios.filter(user => user.role === filtroRol);
      }

      setUsuarios(usuariosFiltrados);

    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const cambiarRolUsuario = (usuarioId: string, nuevoRol: string) => {
    if (userRole !== 'superadmin') {
      alert('Solo el Super Admin puede cambiar roles');
      return;
    }

    const usuariosActualizados = usuarios.map(user =>
      user.id === usuarioId ? { ...user, role: nuevoRol } : user
    );

    setUsuarios(usuariosActualizados);
    
    // Actualizar en localStorage para usuarios registrados
    const usuariosRegistrados: Usuario[] = JSON.parse(
      localStorage.getItem('usuariosRegistrados') || '[]'
    );
    
    const usuariosRegistradosActualizados = usuariosRegistrados.map(user =>
      user.id === usuarioId ? { ...user, role: nuevoRol } : user
    );
    
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistradosActualizados));
    
    alert(`Rol cambiado exitosamente a ${nuevoRol}`);
  };

  const toggleEstadoUsuario = (usuarioId: string) => {
    const usuariosActualizados = usuarios.map(user =>
      user.id === usuarioId ? { ...user, activo: !user.activo } : user
    );

    setUsuarios(usuariosActualizados);
    
    // Actualizar en localStorage
    const usuariosRegistrados: Usuario[] = JSON.parse(
      localStorage.getItem('usuariosRegistrados') || '[]'
    );
    
    const usuariosRegistradosActualizados = usuariosRegistrados.map(user =>
      user.id === usuarioId ? { ...user, activo: !user.activo } : user
    );
    
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistradosActualizados));
    
    alert(`Estado del usuario actualizado`);
  };

  const getBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return { bg: '#DC2626', color: 'white' };
      case 'admin': return { bg: '#059669', color: 'white' };
      case 'broker': return { bg: '#3B82F6', color: 'white' };
      default: return { bg: '#6B7280', color: 'white' };
    }
  };

  const getEspecialidadIcon = (especialidad: string) => {
    switch (especialidad) {
      case 'residencial': return '🏠';
      case 'comercial': return '🛍️';
      case 'industrial': return '🏭';
      case 'mixto': return '🔀';
      default: return '👤';
    }
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
          <p>Cargando panel de administración...</p>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
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
              👥 Gestión de Usuarios
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              {userRole === 'superadmin' ? 'Super Administrador' : 'Administrador'} - Gestiona todos los usuarios del sistema
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

        {/* Estadísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{usuarios.length}</div>
            <div style={{ opacity: '0.8' }}>Total Usuarios</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {usuarios.filter(u => u.role === 'broker').length}
            </div>
            <div style={{ opacity: '0.8' }}>Brokers</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {usuarios.filter(u => u.role === 'admin').length}
            </div>
            <div style={{ opacity: '0.8' }}>Administradores</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {usuarios.filter(u => u.activo).length}
            </div>
            <div style={{ opacity: '0.8' }}>Usuarios Activos</div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ 
          background: 'white', 
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                Filtrar por Rol:
              </label>
              <select
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="todos">Todos los roles</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Administradores</option>
                <option value="broker">Brokers</option>
              </select>
            </div>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', fontSize: '14px', color: '#64748b' }}>
              <span>Mostrando: <strong>{usuarios.length}</strong> usuarios</span>
            </div>
          </div>
        </div>

        {/* Lista de Usuarios */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {usuarios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>👥</div>
              <h3 style={{ marginBottom: '8px', color: '#374151' }}>No hay usuarios</h3>
              <p style={{ marginBottom: '24px' }}>No se encontraron usuarios con los filtros aplicados</p>
            </div>
          ) : (
            <>
              {/* Header de la tabla */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                gap: '16px',
                padding: '20px',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                <div>Usuario</div>
                <div>Contacto</div>
                <div>Especialidad</div>
                <div>Rol</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>

              {/* Lista de usuarios */}
              <div>
                {usuarios.map((usuario, index) => {
                  const badgeColor = getBadgeColor(usuario.role);
                  
                  return (
                    <div
                      key={usuario.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                        gap: '16px',
                        padding: '20px',
                        borderBottom: index < usuarios.length - 1 ? '1px solid #F1F5F9' : 'none',
                        alignItems: 'center'
                      }}
                    >
                      {/* Usuario */}
                      <div>
                        <div style={{ fontWeight: '600', color: '#2D3436' }}>
                          {usuario.nombre}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          Registro: {new Date(usuario.fechaRegistro).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Contacto */}
                      <div>
                        <div style={{ color: '#2D3436', fontSize: '14px' }}>{usuario.email}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          {usuario.telefono}
                        </div>
                      </div>

                      {/* Especialidad */}
                      <div>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px',
                          background: '#F3F4F6',
                          color: '#374151',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {getEspecialidadIcon(usuario.especialidad)} {usuario.especialidad}
                        </span>
                      </div>

                      {/* Rol */}
                      <div>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px',
                          background: badgeColor.bg,
                          color: badgeColor.color,
                          display: 'inline-block',
                          fontWeight: '600'
                        }}>
                          {usuario.role}
                        </span>
                      </div>

                      {/* Estado */}
                      <div>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px',
                          background: usuario.activo ? '#10B98120' : '#EF444420',
                          color: usuario.activo ? '#059669' : '#DC2626',
                          display: 'inline-block',
                          fontWeight: '600'
                        }}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      {/* Acciones */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {userRole === 'superadmin' && usuario.role !== 'superadmin' && (
                          <select
                            value={usuario.role}
                            onChange={(e) => cambiarRolUsuario(usuario.id, e.target.value)}
                            style={{
                              padding: '6px 8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '12px',
                              background: 'white'
                            }}
                          >
                            <option value="broker">Broker</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                        
                        <button
                          onClick={() => toggleEstadoUsuario(usuario.id)}
                          style={{
                            color: usuario.activo ? '#DC2626' : '#059669',
                            background: usuario.activo ? '#FEF2F2' : '#F0FDF4',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          {usuario.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Información para Admin */}
        {userRole === 'admin' && (
          <div style={{ 
            background: '#FEF3C7', 
            padding: '15px',
            borderRadius: '8px',
            marginTop: '20px',
            border: '1px solid #F59E0B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#92400E' }}>
              <span>ℹ️</span>
              <div>
                <strong>Información:</strong> Como Administrador, puedes ver todos los usuarios pero solo el Super Admin puede cambiar roles.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}