// app/dashboard/clientes/page.tsx - CÓDIGO CORREGIDO
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  estatus: string;
  fecha_creacion: string;
  broker_id?: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchClientes();
  }, []);

const fetchClientes = async () => {
  try {
    setLoading(true);
    
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole') || 'broker';
    setUserRole(role);

    if (!email) {
      router.push('/login');
      return;
    }

    // TEMPORAL: Mostrar todos los clientes sin filtrar por broker
    // Esto funcionará hasta que configuremos el RLS correctamente
    let query = supabase
      .from('clientes')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error details:', error);
      
      // Si hay error de RLS, intentar consulta simple
      if (error.code === '42501' || error.message.includes('policy')) {
        console.log('Error de RLS, intentando consulta básica...');
        const { data: simpleData } = await supabase
          .from('clientes')
          .select('id, nombre, email, telefono, tipo, estatus, fecha_creacion')
          .order('fecha_creacion', { ascending: false })
          .limit(100);
        
        setClientes(simpleData || []);
        return;
      }
      
      throw error;
    }

    setClientes(data || []);

  } catch (error) {
    console.error('Error fetching clientes:', error);
    
    // Mostrar datos de ejemplo si hay error
    const ejemploClientes: Cliente[] = [
      {
        id: '1',
        nombre: 'Carlos Rodríguez',
        email: 'carlos@empresa.com',
        telefono: '+52 55 1234 5678',
        tipo: 'comprador',
        estatus: 'activo',
        fecha_creacion: new Date().toISOString()
      },
      {
        id: '2', 
        nombre: 'Ana Martínez',
        email: 'ana@comercial.com',
        telefono: '+52 55 8765 4321',
        tipo: 'vendedor',
        estatus: 'activo',
        fecha_creacion: new Date().toISOString()
      }
    ];
    
    setClientes(ejemploClientes);
    alert('Usando datos de ejemplo. Configura el RLS en Supabase.');
  } finally {
    setLoading(false);
  }
};

  const deleteCliente = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recargar la lista
      fetchClientes();
      alert('Cliente eliminado correctamente');
    } catch (error) {
      console.error('Error deleting cliente:', error);
      alert('Error al eliminar el cliente');
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
          <p>Cargando clientes...</p>
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
              Gestión de Clientes
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              {userRole === 'admin' ? 'Todos los clientes del sistema' : 'Mis clientes asignados'}
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
              ← Volver
            </Link>
            <Link
              href="/dashboard/clientes/crear"
              style={{
                padding: '10px 20px',
                background: '#10B981',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              + Nuevo Cliente
            </Link>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
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
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{clientes.length}</div>
            <div style={{ opacity: '0.8' }}>Total Clientes</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {clientes.filter(c => c.estatus === 'activo').length}
            </div>
            <div style={{ opacity: '0.8' }}>Clientes Activos</div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {clientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>👥</div>
              <h3 style={{ marginBottom: '8px', color: '#374151' }}>No hay clientes</h3>
              <p style={{ marginBottom: '24px' }}>Comienza agregando tu primer cliente</p>
              <Link
                href="/dashboard/clientes/crear"
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
                + Agregar Primer Cliente
              </Link>
            </div>
          ) : (
            <>
              {/* Header de la tabla */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '16px',
                padding: '20px',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontWeight: '600',
                color: '#374151'
              }}>
                <div>Nombre</div>
                <div>Contacto</div>
                <div>Tipo</div>
                <div>Estatus</div>
                <div>Acciones</div>
              </div>

              {/* Lista de clientes */}
              <div>
                {clientes.map((cliente, index) => (
                  <div
                    key={cliente.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                      gap: '16px',
                      padding: '20px',
                      borderBottom: index < clientes.length - 1 ? '1px solid #F1F5F9' : 'none',
                      alignItems: 'center'
                    }}
                  >
                    {/* Nombre */}
                    <div>
                      <div style={{ fontWeight: '600', color: '#2D3436' }}>
                        {cliente.nombre}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        Creado: {new Date(cliente.fecha_creacion).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Contacto */}
                    <div>
                      <div style={{ color: '#2D3436' }}>{cliente.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        {cliente.telefono}
                      </div>
                    </div>

                    {/* Tipo */}
                    <div>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        background: cliente.tipo === 'comprador' ? '#10B98120' : '#3B82F620',
                        color: cliente.tipo === 'comprador' ? '#059669' : '#2563EB'
                      }}>
                        {cliente.tipo}
                      </span>
                    </div>

                    {/* Estatus */}
                    <div>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        background: cliente.estatus === 'activo' ? '#10B98120' : '#6B728020',
                        color: cliente.estatus === 'activo' ? '#059669' : '#6B7280'
                      }}>
                        {cliente.estatus}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href={`/dashboard/clientes/editar/${cliente.id}`}
                        style={{
                          color: '#2563EB',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '6px 12px',
                          background: '#EFF6FF',
                          borderRadius: '6px'
                        }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteCliente(cliente.id)}
                        style={{
                          color: '#DC2626',
                          background: '#FEF2F2',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}