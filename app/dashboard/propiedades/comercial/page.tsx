'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface PropiedadComercial {
  id: string;
  nombre_plaza: string;
  ubicacion: string;
  numero_locales: number;
  cajones_estacionamiento: number;
  renta_mensual: number;
  precio_venta: number;
}

export default function PropiedadesComercialPage() {
  const [propiedades, setPropiedades] = useState<PropiedadComercial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const fetchPropiedades = async () => {
    try {
      const { data, error } = await supabase
        .from('propiedades_comerciales')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error) throw error;
      setPropiedades(data || []);
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
        .from('propiedades_comerciales')
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando propiedades comerciales...</div>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
              Propiedades Comerciales
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              Gestión de plazas comerciales y locales
            </p>
          </div>
          <Link
            href="/dashboard/propiedades/comercial/agregar"
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
              {propiedades.reduce((sum, prop) => sum + (prop.numero_locales || 0), 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Locales</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {propiedades.reduce((sum, prop) => sum + (prop.cajones_estacionamiento || 0), 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Estacionamientos</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              ${propiedades.reduce((sum, prop) => sum + (prop.renta_mensual || 0), 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Renta Mensual Total</div>
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
                    Plaza Comercial
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Ubicación
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Locales
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Estacionamiento
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Renta Mensual
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map((propiedad) => (
                  <tr key={propiedad.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#2d3436' }}>
                        {propiedad.nombre_plaza || 'Sin nombre'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#2d3436' }}>{propiedad.ubicacion || 'Sin ubicación'}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500' }}>
                        {propiedad.numero_locales || 0} locales
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500' }}>
                        {propiedad.cajones_estacionamiento || 0} cajones
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#181f42' }}>
                        {propiedad.renta_mensual ? `$${propiedad.renta_mensual.toLocaleString()}` : 'Consultar'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link 
                          href={`/dashboard/propiedades/comercial/editar/${propiedad.id}`}
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
                          onClick={() => handleEliminarPropiedad(propiedad.id, propiedad.nombre_plaza || 'esta propiedad')}
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

          {propiedades.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>🛍️</div>
              <h3 style={{ marginBottom: '8px', color: '#2d3436' }}>No hay propiedades comerciales</h3>
              <p style={{ marginBottom: '24px' }}>Comienza agregando la primera propiedad comercial</p>
              <Link
                href="/dashboard/propiedades/comercial/agregar"
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