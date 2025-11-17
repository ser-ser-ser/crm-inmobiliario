// app/dashboard/reportes/page.tsx - PIPELINE CORREGIDO
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ClientePipeline {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  etapa_pipeline: string;
  probabilidad_cierre: number;
  ultimo_contacto: string;
  proxima_accion: string;
  broker_nombre: string;
}

interface PipelineStats {
  total: number;
  prospecto: number;
  calificado: number;
  negociacion: number;
  cerrado: number;
  valorPotencial: number;
}

export default function PipelinePage() {
  const [clientes, setClientes] = useState<ClientePipeline[]>([]);
  const [stats, setStats] = useState<PipelineStats>({
    total: 0,
    prospecto: 0,
    calificado: 0,
    negociacion: 0,
    cerrado: 0,
    valorPotencial: 0
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState('todas');
  const router = useRouter();

  const etapas = [
    { id: 'prospecto', nombre: '🔍 Prospecto', color: '#6B7280', desc: 'Clientes nuevos por contactar' },
    { id: 'calificado', nombre: '✅ Calificado', color: '#3B82F6', desc: 'Clientes interesados' },
    { id: 'negociacion', nombre: '💼 Negociación', color: '#F59E0B', desc: 'En proceso de oferta' },
    { id: 'cerrado', nombre: '🎉 Cerrado', color: '#10B981', desc: 'Ventas concretadas' }
  ];

  useEffect(() => {
    loadPipelineData();
  }, [filtroEtapa]);

  const loadPipelineData = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole') || 'broker';
      setUserRole(role);

      if (!email) {
        router.push('/login');
        return;
      }

      let brokerId = null;

      // Si no es admin, obtener broker_id del usuario
      if (role !== 'admin') {
        const { data: usuario, error: userError } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', email)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }

        brokerId = usuario?.broker_id;
      }

      // Consulta base de clientes
      let query = supabase
        .from('clientes')
        .select(`
          id,
          nombre,
          email,
          telefono,
          tipo,
          etapa_pipeline,
          probabilidad_cierre,
          ultimo_contacto,
          proxima_accion,
          presupuesto_max,
          broker_id
        `);

      // Aplicar filtro por broker si no es admin
      if (role !== 'admin' && brokerId) {
        query = query.eq('broker_id', brokerId);
      }

      // Aplicar filtro de etapa si no es "todas"
      if (filtroEtapa !== 'todas') {
        query = query.eq('etapa_pipeline', filtroEtapa);
      }

      const { data: clientesData, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Obtener nombres de brokers para los clientes
      const clientesConBrokers = await Promise.all(
        (clientesData || []).map(async (cliente) => {
          let brokerNombre = 'Sin broker';
          
          if (cliente.broker_id) {
            const { data: brokerData } = await supabase
              .from('brokers')
              .select('nombre')
              .eq('id', cliente.broker_id)
              .single();
            
            brokerNombre = brokerData?.nombre || 'Broker no encontrado';
          }

          return {
            id: cliente.id,
            nombre: cliente.nombre,
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            tipo: cliente.tipo,
            etapa_pipeline: cliente.etapa_pipeline || 'prospecto',
            probabilidad_cierre: cliente.probabilidad_cierre || 0,
            ultimo_contacto: cliente.ultimo_contacto,
            proxima_accion: cliente.proxima_accion,
            broker_nombre: brokerNombre
          };
        })
      );

      setClientes(clientesConBrokers);
      calcularEstadísticas(clientesConBrokers);

    } catch (error) {
      console.error('Error loading pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadísticas = (clientes: ClientePipeline[]) => {
    const stats: PipelineStats = {
      total: clientes.length,
      prospecto: clientes.filter(c => c.etapa_pipeline === 'prospecto').length,
      calificado: clientes.filter(c => c.etapa_pipeline === 'calificado').length,
      negociacion: clientes.filter(c => c.etapa_pipeline === 'negociacion').length,
      cerrado: clientes.filter(c => c.etapa_pipeline === 'cerrado').length,
      valorPotencial: 0
    };

    setStats(stats);
  };

  const moverEtapa = async (clienteId: string, nuevaEtapa: string) => {
    try {
      const nuevaProbabilidad = 
        nuevaEtapa === 'prospecto' ? 10 :
        nuevaEtapa === 'calificado' ? 30 :
        nuevaEtapa === 'negociacion' ? 70 : 100;

      const { error } = await supabase
        .from('clientes')
        .update({ 
          etapa_pipeline: nuevaEtapa,
          probabilidad_cierre: nuevaProbabilidad
        })
        .eq('id', clienteId);

      if (error) throw error;

      // Recargar datos
      loadPipelineData();
      
    } catch (error) {
      console.error('Error moviendo etapa:', error);
      alert('Error al actualizar la etapa');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Cargando pipeline de ventas...</p>
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
              style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
            >
              ← Volver al Dashboard
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
                Pipeline de Ventas
              </h1>
              <p style={{ color: '#64748b', fontSize: '16px' }}>
                Seguimiento de clientes y oportunidades
              </p>
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              Rol: <strong>{userRole === 'admin' ? '👑 Administrador' : '🤝 Broker'}</strong>
            </div>
          </div>

          {/* Filtros */}
          <div style={{ 
            background: 'white', 
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={filtroEtapa}
                onChange={(e) => setFiltroEtapa(e.target.value)}
                style={{ 
                  padding: '10px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="todas">Todas las etapas</option>
                {etapas.map(etapa => (
                  <option key={etapa.id} value={etapa.id}>{etapa.nombre}</option>
                ))}
              </select>
              
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', fontSize: '14px', color: '#64748b' }}>
                <span>Total: <strong>{stats.total}</strong> clientes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas del Pipeline */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          {etapas.map(etapa => {
            const count = stats[etapa.id as keyof PipelineStats] as number;
            const porcentaje = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={etapa.id} style={{ 
                background: 'white', 
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                border: `2px solid ${etapa.color}20`,
                borderLeft: `4px solid ${etapa.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: etapa.color, textTransform: 'uppercase' }}>
                    {etapa.nombre.split(' ')[1]}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{porcentaje.toFixed(0)}%</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436' }}>{count}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{etapa.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Lista de Clientes */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
            gap: '16px',
            padding: '20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontWeight: '600',
            color: '#374151',
            fontSize: '14px'
          }}>
            <div>Cliente</div>
            <div>Contacto</div>
            <div>Etapa</div>
            <div>Probabilidad</div>
            <div>Broker</div>
            <div>Acciones</div>
          </div>

          <div>
            {clientes.map((cliente) => {
              const etapa = etapas.find(e => e.id === cliente.etapa_pipeline);
              
              return (
                <div
                  key={cliente.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                    gap: '16px',
                    padding: '20px',
                    borderBottom: '1px solid #f1f5f9',
                    alignItems: 'center'
                  }}
                >
                  {/* Cliente */}
                  <div>
                    <div style={{ fontWeight: '600', color: '#2d3436' }}>{cliente.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {cliente.tipo}
                    </div>
                  </div>

                  {/* Contacto */}
                  <div>
                    <div style={{ color: '#2d3436', fontSize: '14px' }}>{cliente.email || '-'}</div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                      {cliente.telefono || '-'}
                    </div>
                  </div>

                  {/* Etapa */}
                  <div>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: etapa?.color + '20',
                        color: etapa?.color,
                        display: 'inline-block'
                      }}
                    >
                      {etapa?.nombre.split(' ')[0]} {cliente.etapa_pipeline}
                    </span>
                  </div>

                  {/* Probabilidad */}
                  <div>
                    <div style={{ 
                      background: '#e5e7eb', 
                      borderRadius: '10px', 
                      height: '8px',
                      marginBottom: '4px'
                    }}>
                      <div 
                        style={{ 
                          background: cliente.probabilidad_cierre >= 70 ? '#10B981' : 
                                    cliente.probabilidad_cierre >= 30 ? '#F59E0B' : '#EF4444',
                          width: `${cliente.probabilidad_cierre}%`,
                          height: '100%',
                          borderRadius: '10px'
                        }} 
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                      {cliente.probabilidad_cierre}%
                    </div>
                  </div>

                  {/* Broker */}
                  <div style={{ color: '#2d3436', fontSize: '14px' }}>
                    {cliente.broker_nombre}
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={cliente.etapa_pipeline}
                      onChange={(e) => moverEtapa(cliente.id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'white'
                      }}
                    >
                      {etapas.map(etapa => (
                        <option key={etapa.id} value={etapa.id}>
                          {etapa.nombre.split(' ')[1]}
                        </option>
                      ))}
                    </select>
                    
                    <Link
                      href={`/dashboard/clientes/editar/${cliente.id}`}
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '6px 8px',
                        background: '#eff6ff',
                        borderRadius: '6px'
                      }}
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {clientes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>📊</div>
              <h3 style={{ marginBottom: '8px', color: '#2d3436' }}>No hay clientes en el pipeline</h3>
              <p style={{ marginBottom: '24px' }}>Comienza agregando clientes para ver el funnel de ventas</p>
              <Link
                href="/dashboard/clientes"
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
                Gestionar Clientes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}