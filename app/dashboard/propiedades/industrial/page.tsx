'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface PropiedadIndustrial {
  id: string;
  marca: string;
  giro_industrial: string;
  ubicacion_coordenadas: string;
  precio_mn: number;
  superficie_total: number;
  año_construccion: number;
  estatus: string;
  broker_id: string;
  broker_nombre?: string;
  creado_en?: string;
}

export default function PropiedadesIndustrialPage() {
  const [propiedades, setPropiedades] = useState<PropiedadIndustrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
        .from('propiedades_industriales')
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

  const handleEliminarPropiedad = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la propiedad "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('propiedades_industriales')
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
    const matchesSearch = propiedad.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propiedad.giro_industrial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propiedad.ubicacion_coordenadas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         propiedad.broker_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstatus = filtroEstatus === 'todos' || propiedad.estatus === filtroEstatus;

    return matchesSearch && matchesEstatus;
  });

  const estatusOptions = ['todos', 'disponible', 'ocupado', 'en_venta', 'en_renta'];

  const getEstatusBadgeStyle = (estatus: string) => {
    switch (estatus) {
      case 'disponible':
        return { background: '#dcfce7', color: '#166534' };
      case 'ocupado':
        return { background: '#fef3c7', color: '#92400e' };
      case 'en_venta':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'en_renta':
        return { background: '#f3e8ff', color: '#7c3aed' };
      default:
        return { background: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando propiedades industriales...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '24px 32px' 
      }}>
        {/* Botón para regresar al Dashboard */}
        <div style={{ marginBottom: '16px' }}>
          <Link 
            href="/dashboard"
            style={{ 
              color: '#64748b', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Volver al Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
              Propiedades Industriales
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              {userRole === 'admin' || userRole === 'superadmin' 
                ? 'Todas las propiedades industriales - Vista Administrador' 
                : 'Mis propiedades industriales - Vista Broker'}
            </p>
          </div>
          <Link
            href="/dashboard/propiedades/industrial/agregar"
            style={{
              background: '#181f42',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            + Nueva Propiedad
          </Link>
        </div>

        {/* Filtros y Búsqueda */}
        <div style={{ 
          background: '#f8fafc', 
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
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
                    {estatus === 'todos' ? 'Todos los estatus' : estatus.charAt(0).toUpperCase() + estatus.slice(1)}
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
                placeholder="Buscar por marca, giro, ubicación o broker..."
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

      {/* Contenido */}
      <div style={{ padding: '32px' }}>
        {/* Estadísticas */}
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
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {propiedades.length}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Propiedades</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {propiedades.filter(p => p.precio_mn && p.precio_mn > 0).length}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Con Precio</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {propiedades.reduce((sum, prop) => sum + (prop.superficie_total || 0), 0)} m²
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Superficie Total</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              ${propiedades.reduce((sum, prop) => sum + (prop.precio_mn || 0), 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Valor Total</div>
          </div>
        </div>

        {/* Lista de propiedades */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Propiedad
                  </th>
                  {(userRole === 'admin' || userRole === 'superadmin') && (
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                      Broker
                    </th>
                  )}
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Giro
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Ubicación
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Superficie
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Precio
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Estatus
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPropiedades.map((propiedad) => (
                  <tr key={propiedad.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#2d3436' }}>
                        {propiedad.marca || 'Sin nombre'}
                      </div>
                    </td>
                    {(userRole === 'admin' || userRole === 'superadmin') && (
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: '#2d3436', fontWeight: '500' }}>
                          {propiedad.broker_nombre || 'Sin broker'}
                        </div>
                      </td>
                    )}
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#2d3436' }}>{propiedad.giro_industrial || 'No especificado'}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#64748b', fontSize: '14px' }}>
                        {propiedad.ubicacion_coordenadas || 'Sin ubicación'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500' }}>
                        {propiedad.superficie_total ? `${propiedad.superficie_total} m²` : 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#181f42' }}>
                        {propiedad.precio_mn ? `$${propiedad.precio_mn.toLocaleString()}` : 'Consultar'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          ...getEstatusBadgeStyle(propiedad.estatus || 'disponible')
                        }}
                      >
                        {propiedad.estatus || 'disponible'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link 
                          href={`/dashboard/propiedades/industrial/editar/${propiedad.id}`}
                          style={{ 
                            color: '#181f42',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleEliminarPropiedad(propiedad.id, propiedad.marca || 'esta propiedad')}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPropiedades.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>🏭</div>
              <h3 style={{ marginBottom: '8px', color: '#2d3436' }}>No hay propiedades industriales</h3>
              <p style={{ marginBottom: '24px' }}>Comienza agregando la primera propiedad industrial</p>
              <Link
                href="/dashboard/propiedades/industrial/agregar"
                style={{
                  background: '#181f42',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                + Agregar Primera Propiedad
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}