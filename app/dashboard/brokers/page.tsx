'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Broker {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  estatus: string;
  propiedades_activas: number;
  clientes_activos: number;
  años_experiencia: number;
  comision_promedio: number;
  licencia: string;
}

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error) throw error;
      setBrokers(data || []);
    } catch (error) {
      console.error('Error fetching brokers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarBroker = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al broker "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('brokers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando broker:', error);
        alert(`Error al eliminar broker: ${error.message}`);
        throw error;
      }

      // Actualizar la lista eliminando el broker
      setBrokers(prev => prev.filter(broker => broker.id !== id));
      alert('Broker eliminado correctamente');
      
    } catch (error) {
      console.error('Error eliminando broker:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBrokers = brokers.filter(broker =>
    broker.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando brokers...</div>
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
              Brokers
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              Gestión de equipo comercial
            </p>
          </div>
          <Link
            href="/dashboard/brokers/agregar"
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
            + Nuevo Broker
          </Link>
        </div>

        {/* Búsqueda */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Buscar brokers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <span style={{ 
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b'
            }}>
              🔍
            </span>
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
              {brokers.length}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Brokers</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {brokers.filter(b => b.estatus === 'activo').length}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Brokers Activos</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {brokers.reduce((sum, broker) => sum + broker.propiedades_activas, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Propiedades Activas</div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436' }}>
              {brokers.reduce((sum, broker) => sum + broker.clientes_activos, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Clientes Activos</div>
          </div>
        </div>

        {/* Lista de brokers */}
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
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Broker
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Contacto
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Especialidad
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Experiencia
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Estadísticas
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Estado
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBrokers.map((broker) => (
                  <tr key={broker.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#2d3436' }}>
                        {broker.nombre}
                      </div>
                      {broker.licencia && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Lic: {broker.licencia}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#2d3436' }}>{broker.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        {broker.telefono || 'Sin teléfono'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: '#e3f2fd',
                        color: '#1976d2',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {broker.especialidad || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ color: '#2d3436' }}>
                        {broker.años_experiencia || 0} años
                      </div>
                      {broker.comision_promedio && (
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {broker.comision_promedio}% comisión
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '13px' }}>
                        <div>🏠 {broker.propiedades_activas} propiedades</div>
                        <div>👥 {broker.clientes_activos} clientes</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: broker.estatus === 'activo' ? '#d1fae5' : '#fee2e2',
                        color: broker.estatus === 'activo' ? '#065f46' : '#991b1b'
                      }}>
                        {broker.estatus}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link 
                          href={`/dashboard/brokers/editar/${broker.id}`}
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
                          onClick={() => handleEliminarBroker(broker.id, broker.nombre)}
                          disabled={deletingId === broker.id}
                          style={{
                            color: deletingId === broker.id ? '#9ca3af' : '#dc2626',
                            background: 'none',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: deletingId === broker.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {deletingId === broker.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {brokers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>👥</div>
              <h3 style={{ marginBottom: '8px', color: '#2d3436' }}>No hay brokers registrados</h3>
              <p style={{ marginBottom: '24px' }}>Comienza agregando el primer broker a tu equipo</p>
              <Link
                href="/dashboard/brokers/agregar"
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
                + Agregar Primer Broker
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}