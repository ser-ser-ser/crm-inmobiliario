// /dashboard/propiedades/residencial/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface PropiedadResidencial {
  id: string;
  creado_en: string;
  titulo: string;
  direccion: string;
  colonia: string;
  ciudad: string;
  estado: string;
  tipo_propiedad: string;
  precio_venta: number;
  precio_renta: number;
  superficie_terreno: number;
  superficie_construccion: number;
  habitaciones: number;
  banos: number;
  cocheras: number;
  estatus: string;
  destacado: boolean;
  broker_id: string;
  broker_nombre?: string;
}

export default function ListaPropiedadesResidenciales() {
  const [propiedades, setPropiedades] = useState<PropiedadResidencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const fetchPropiedades = async () => {
    try {
      // Obtener información del usuario logueado
      const userEmail = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole') || 'broker';
      setUserRole(role);

      if (!userEmail) {
        console.error('No user email found');
        return;
      }

      let brokerId = null;

      // Si no es admin, obtener broker_id del usuario
      if (role !== 'admin' && role !== 'superadmin') {
        const { data: usuario, error: userError } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', userEmail)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }

        brokerId = usuario?.broker_id;
      }

      // Consulta base con JOIN para obtener nombre del broker
      let query = supabase
        .from('propiedades_residenciales')
        .select(`
          *,
          brokers!inner(nombre)
        `)
        .order('creado_en', { ascending: false });

      // Aplicar filtro por broker si no es admin
      if (brokerId) {
        query = query.eq('broker_id', brokerId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformar datos para incluir broker_nombre
      const propiedadesConBroker = (data || []).map(propiedad => ({
        ...propiedad,
        broker_nombre: propiedad.brokers?.nombre || 'Sin broker'
      }));

      setPropiedades(propiedadesConBroker);
    } catch (error) {
      console.error('Error fetching propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPropiedad = async (id: string, titulo: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la propiedad "${titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('propiedades_residenciales')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando propiedad:', error);
        alert(`Error al eliminar propiedad: ${error.message}`);
        throw error;
      }

      // Actualizar la lista eliminando la propiedad
      setPropiedades(prev => prev.filter(propiedad => propiedad.id !== id));
      alert('Propiedad eliminada correctamente');
      
    } catch (error) {
      console.error('Error eliminando propiedad:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPropiedades = propiedades.filter(propiedad => {
    const matchesSearch = propiedad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propiedad.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propiedad.colonia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propiedad.broker_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filtroTipo === 'todos' || propiedad.tipo_propiedad === filtroTipo;
    const matchesEstatus = filtroEstatus === 'todos' || propiedad.estatus === filtroEstatus;

    return matchesSearch && matchesTipo && matchesEstatus;
  });

  const tiposPropiedad = ['todos', 'casa', 'departamento', 'terreno', 'duplex'];
  const estatusOptions = ['todos', 'disponible', 'vendido', 'rentado', 'en_proceso'];

  const getTipoBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'casa':
        return { background: '#dcfce7', color: '#166534' };
      case 'departamento':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'terreno':
        return { background: '#fef3c7', color: '#92400e' };
      case 'duplex':
        return { background: '#f3e8ff', color: '#7c3aed' };
      default:
        return { background: '#f3f4f6', color: '#374151' };
    }
  };

  const getEstatusBadgeStyle = (estatus: string) => {
    switch (estatus) {
      case 'disponible':
        return { background: '#dcfce7', color: '#166534' };
      case 'vendido':
        return { background: '#fef3c7', color: '#92400e' };
      case 'rentado':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'en_proceso':
        return { background: '#f3f4f6', color: '#6b7280' };
      default:
        return { background: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando propiedades...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Link 
              href="/dashboard"
              style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Volver al Dashboard
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
                Propiedades Residenciales
              </h1>
              <p style={{ color: '#64748b', fontSize: '16px' }}>
                {userRole === 'admin' || userRole === 'superadmin' 
                  ? 'Todas las propiedades - Vista Administrador' 
                  : 'Mis propiedades - Vista Broker'}
              </p>
            </div>
            <Link
              href="/dashboard/propiedades/residencial/agregar"
              style={{
                padding: '12px 24px',
                background: '#181f42',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              + Agregar Propiedad
            </Link>
          </div>

          {/* Filtros y Búsqueda */}
          <div style={{ 
            background: 'white', 
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', marginBottom: '16px' }}>
              {/* Filtro Tipo */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  Tipo de Propiedad
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {tiposPropiedad.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo === 'todos' ? 'Todos los tipos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Estatus */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  Estatus
                </label>
                <select
                  value={filtroEstatus}
                  onChange={(e) => setFiltroEstatus(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {estatusOptions.map(estatus => (
                    <option key={estatus} value={estatus}>
                      {estatus === 'todos' ? 'Todos' : estatus.charAt(0).toUpperCase() + estatus.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Búsqueda */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Buscar por título, ciudad, colonia o broker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436' }}>{propiedades.length}</div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Propiedades</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>
              {propiedades.filter(p => p.estatus === 'disponible').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Disponibles</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
              {propiedades.filter(p => p.tipo_propiedad === 'casa').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Casas</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#9a3412' }}>
              {propiedades.filter(p => p.tipo_propiedad === 'departamento').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Departamentos</div>
          </div>
        </div>

        {/* Propiedades Table */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          border: '1px solid #e2e8f0',
          overflowX: 'auto'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: userRole === 'admin' || userRole === 'superadmin' 
              ? '2fr 1fr 1fr 1fr 1fr 1fr 1fr auto' 
              : '2fr 1fr 1fr 1fr 1fr 1fr auto',
            gap: '16px',
            padding: '20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: '600',
            color: '#374151',
            fontSize: '14px'
          }}>
            <div>Propiedad</div>
            <div>Tipo</div>
            {(userRole === 'admin' || userRole === 'superadmin') && <div>Broker</div>}
            <div>Ubicación</div>
            <div>Precio</div>
            <div>Características</div>
            <div>Estatus</div>
            <div>Acciones</div>
          </div>

          <div>
            {filteredPropiedades.map((propiedad) => (
              <div
                key={propiedad.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: userRole === 'admin' || userRole === 'superadmin' 
                    ? '2fr 1fr 1fr 1fr 1fr 1fr 1fr auto' 
                    : '2fr 1fr 1fr 1fr 1fr 1fr auto',
                  gap: '16px',
                  padding: '20px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'center'
                }}
              >
                {/* Propiedad */}
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3436' }}>{propiedad.titulo}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {propiedad.direccion}
                  </div>
                </div>

                {/* Tipo */}
                <div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...getTipoBadgeStyle(propiedad.tipo_propiedad)
                    }}
                  >
                    {propiedad.tipo_propiedad}
                  </span>
                </div>

                {/* Broker (solo para admin/superadmin) */}
                {(userRole === 'admin' || userRole === 'superadmin') && (
                  <div style={{ color: '#2d3436', fontSize: '14px', fontWeight: '500' }}>
                    {propiedad.broker_nombre}
                  </div>
                )}

                {/* Ubicación */}
                <div>
                  <div style={{ color: '#2d3436', fontSize: '14px' }}>{propiedad.ciudad}</div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                    {propiedad.colonia}
                  </div>
                </div>

                {/* Precio */}
                <div style={{ color: '#2d3436', fontSize: '14px', fontWeight: '600' }}>
                  {propiedad.precio_venta ? (
                    `$${propiedad.precio_venta.toLocaleString()}`
                  ) : propiedad.precio_renta ? (
                    `Renta: $${propiedad.precio_renta.toLocaleString()}`
                  ) : (
                    <span style={{ color: '#9ca3af' }}>Consultar</span>
                  )}
                </div>

                {/* Características */}
                <div style={{ color: '#2d3436', fontSize: '14px' }}>
                  <div>{propiedad.habitaciones} hab.</div>
                  <div>{propiedad.banos} baños</div>
                  <div>{propiedad.cocheras} cocheras</div>
                </div>

                {/* Estatus */}
                <div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...getEstatusBadgeStyle(propiedad.estatus)
                    }}
                  >
                    {propiedad.estatus}
                  </span>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    href={`/dashboard/propiedades/residencial/editar/${propiedad.id}`}
                    style={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleEliminarPropiedad(propiedad.id, propiedad.titulo)}
                    disabled={deletingId === propiedad.id}
                    style={{
                      color: deletingId === propiedad.id ? '#9ca3af' : '#dc2626',
                      background: 'none',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: deletingId === propiedad.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {deletingId === propiedad.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPropiedades.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#64748b' 
            }}>
              No se encontraron propiedades
            </div>
          )}
        </div>
      </div>
    </div>
  );
}