// app/dashboard/reportes-kpis/page.tsx - REPORTES & KPIs AVANZADOS
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface KPIStats {
  totalClientes: number;
  tasaConversion: number;
  tiempoPromedioCierre: number;
  valorTotalPipeline: number;
  clientesNuevosMes: number;
  eficienciaContacto: number;
}

interface EtapaMetrics {
  etapa: string;
  cantidad: number;
  porcentaje: number;
  tiempoPromedio: number;
  valorPromedio: number;
}

export default function ReportesKPIsPage() {
  const [kpis, setKpis] = useState<KPIStats>({
    totalClientes: 0,
    tasaConversion: 0,
    tiempoPromedioCierre: 0,
    valorTotalPipeline: 0,
    clientesNuevosMes: 0,
    eficienciaContacto: 0
  });
  const [etapasMetrics, setEtapasMetrics] = useState<EtapaMetrics[]>([]);
  const [brokerStats, setBrokerStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [periodo, setPeriodo] = useState('30'); // 30, 90, 365 días

  const router = useRouter();

  useEffect(() => {
    loadReportesData();
  }, [periodo]);

  const loadReportesData = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole') || 'broker';
      setUserRole(role);

      if (!email) {
        router.push('/login');
        return;
      }

      let brokerId = null;
      if (role !== 'admin') {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', email)
          .single();
        brokerId = usuario?.broker_id;
      }

      // Cargar todos los datos en paralelo
      const [kpisData, etapasData, brokersData] = await Promise.all([
        loadKPIs(brokerId, role),
        loadEtapasMetrics(brokerId, role),
        role === 'admin' ? loadBrokersStats() : Promise.resolve([])
      ]);

      setKpis(kpisData);
      setEtapasMetrics(etapasData);
      setBrokerStats(brokersData);

    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadKPIs = async (brokerId: string | null, role: string): Promise<KPIStats> => {
    let query = supabase.from('clientes').select('*');

    if (role !== 'admin' && brokerId) {
      query = query.eq('broker_id', brokerId);
    }

    const { data: clientes, error } = await query;
    if (error) throw error;

    const clientesCerrados = clientes?.filter(c => c.etapa_pipeline === 'cerrado') || [];
    const clientesTotales = clientes?.length || 0;
    const clientesNuevosMes = clientes?.filter(c => {
      const fechaCreacion = new Date(c.fecha_creacion);
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      return fechaCreacion >= hace30Dias;
    }).length || 0;

    // Calcular tiempo promedio de cierre (en días)
    const tiemposCierre = clientesCerrados
      .filter(c => c.fecha_creacion && c.fecha_cierre)
      .map(c => {
        const inicio = new Date(c.fecha_creacion);
        const fin = new Date(c.fecha_cierre);
        return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      });

    const tiempoPromedio = tiemposCierre.length > 0 
      ? tiemposCierre.reduce((a, b) => a + b, 0) / tiemposCierre.length 
      : 0;

    // Calcular valor total del pipeline
    const valorTotal = clientes?.reduce((sum, cliente) => {
      return sum + (cliente.valor_operacion || 0);
    }, 0) || 0;

    return {
      totalClientes: clientesTotales,
      tasaConversion: clientesTotales > 0 ? (clientesCerrados.length / clientesTotales) * 100 : 0,
      tiempoPromedioCierre: tiempoPromedio,
      valorTotalPipeline: valorTotal,
      clientesNuevosMes: clientesNuevosMes,
      eficienciaContacto: clientesTotales > 0 ? (clientesCerrados.length / clientesTotales) * 100 : 0
    };
  };

  const loadEtapasMetrics = async (brokerId: string | null, role: string): Promise<EtapaMetrics[]> => {
    let query = supabase.from('clientes').select('*');

    if (role !== 'admin' && brokerId) {
      query = query.eq('broker_id', brokerId);
    }

    const { data: clientes, error } = await query;
    if (error) throw error;

    const etapas = ['prospecto', 'calificado', 'negociacion', 'cerrado'];
    const totalClientes = clientes?.length || 0;

    return etapas.map(etapa => {
      const clientesEtapa = clientes?.filter(c => c.etapa_pipeline === etapa) || [];
      const cantidad = clientesEtapa.length;
      const porcentaje = totalClientes > 0 ? (cantidad / totalClientes) * 100 : 0;
      
      // Calcular valor promedio (simulado para demo)
      const valorPromedio = etapa === 'cerrado' 
        ? 250000 
        : etapa === 'negociacion' 
          ? 200000 
          : etapa === 'calificado' 
            ? 150000 
            : 100000;

      return {
        etapa,
        cantidad,
        porcentaje,
        tiempoPromedio: 0, // En una implementación real, calcularías esto
        valorPromedio
      };
    });
  };

  const loadBrokersStats = async () => {
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, nombre, email');

    if (error) throw error;

    const stats = await Promise.all(
      brokers.map(async (broker) => {
        const { data: clientes } = await supabase
          .from('clientes')
          .select('*')
          .eq('broker_id', broker.id);

        const totalClientes = clientes?.length || 0;
        const clientesCerrados = clientes?.filter(c => c.etapa_pipeline === 'cerrado').length || 0;
        const tasaConversion = totalClientes > 0 ? (clientesCerrados / totalClientes) * 100 : 0;

        return {
          ...broker,
          totalClientes,
          clientesCerrados,
          tasaConversion
        };
      })
    );

    return stats;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p>Cargando reportes avanzados...</p>
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
                Reportes & KPIs Avanzados
              </h1>
              <p style={{ color: '#64748b', fontSize: '16px' }}>
                Métricas de desempeño y análisis del pipeline
              </p>
            </div>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              style={{ 
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Últimos 365 días</option>
            </select>
          </div>
        </div>

        {/* KPIs Principales */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            borderLeft: '4px solid #3B82F6'
          }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Total Clientes</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3436' }}>{kpis.totalClientes}</div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
              +{kpis.clientesNuevosMes} nuevos este mes
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            borderLeft: '4px solid #10B981'
          }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Tasa de Conversión</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3436' }}>
              {kpis.tasaConversion.toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Del pipeline a cerrado
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            borderLeft: '4px solid #F59E0B'
          }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Tiempo Promedio Cierre</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3436' }}>
              {kpis.tiempoPromedioCierre.toFixed(0)} días
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Desde prospecto a cerrado
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            borderLeft: '4px solid #EF4444'
          }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Valor Total Pipeline</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3436' }}>
              {formatCurrency(kpis.valorTotalPipeline)}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Potencial de ventas
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Métricas por Etapa */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3436', marginBottom: '20px' }}>
              Métricas por Etapa del Pipeline
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {etapasMetrics.map((etapa, index) => (
                <div key={etapa.etapa} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2d3436', textTransform: 'capitalize' }}>
                      {etapa.etapa}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {etapa.cantidad} clientes ({etapa.porcentaje.toFixed(1)}%)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#2d3436' }}>
                      {formatCurrency(etapa.valorPromedio)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      valor promedio
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel de Conversión */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3436', marginBottom: '20px' }}>
              Funnel de Conversión
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {etapasMetrics.map((etapa, index) => (
                <div key={etapa.etapa}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#2d3436', textTransform: 'capitalize' }}>
                      {etapa.etapa}
                    </span>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                      {etapa.cantidad} ({etapa.porcentaje.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{ 
                    background: '#e5e7eb', 
                    borderRadius: '10px', 
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        background: 
                          etapa.etapa === 'prospecto' ? '#6B7280' :
                          etapa.etapa === 'calificado' ? '#3B82F6' :
                          etapa.etapa === 'negociacion' ? '#F59E0B' : '#10B981',
                        width: `${etapa.porcentaje}%`,
                        height: '100%',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                  </div>
                  {index < etapasMetrics.length - 1 && (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', margin: '4px 0' }}>
                      ↓ {((etapa.porcentaje / (etapasMetrics[index]?.porcentaje || 100)) * 100).toFixed(0)}% de conversión
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Performance por Broker (solo para admin) */}
        {userRole === 'admin' && brokerStats.length > 0 && (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3436', marginBottom: '20px' }}>
              Performance por Broker
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Broker</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Total Clientes</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Clientes Cerrados</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Tasa Conversión</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {brokerStats.map((broker) => (
                    <tr key={broker.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px' }}>{broker.nombre}</td>
                      <td style={{ padding: '12px' }}>{broker.totalClientes}</td>
                      <td style={{ padding: '12px' }}>{broker.clientesCerrados}</td>
                      <td style={{ padding: '12px' }}>{broker.tasaConversion.toFixed(1)}%</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: broker.tasaConversion >= 20 ? '#10B98120' : 
                                    broker.tasaConversion >= 10 ? '#F59E0B20' : '#EF444420',
                          color: broker.tasaConversion >= 20 ? '#059669' : 
                                broker.tasaConversion >= 10 ? '#D97706' : '#DC2626',
                          display: 'inline-block'
                        }}>
                          {broker.tasaConversion >= 20 ? 'Excelente' : 
                           broker.tasaConversion >= 10 ? 'Bueno' : 'A mejorar'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <Link
            href="/dashboard/reportes"
            style={{
              background: '#181f42',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📊 Ver Pipeline Detallado
          </Link>
          <button
            onClick={() => window.print()}
            style={{
              background: 'white',
              color: '#374151',
              padding: '16px 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🖨️ Exportar Reporte
          </button>
          <Link
            href="/dashboard/clientes"
            style={{
              background: '#059669',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            👥 Gestionar Clientes
          </Link>
        </div>
      </div>
    </div>
  );
}