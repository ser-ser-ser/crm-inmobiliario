'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function AgregarBroker() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // INFORMACIÓN PERSONAL
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',
    
    // INFORMACIÓN PROFESIONAL
    licencia: '',
    años_experiencia: '',
    comision_promedio: '',
    
    // ESTADÍSTICAS
    propiedades_activas: '0',
    clientes_activos: '0',
    ventas_realizadas: '0',
    
    // ESTADO
    estatus: 'activo',
    notas: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('brokers')
        .insert([{
          // Información personal
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          especialidad: formData.especialidad,
          
          // Información profesional
          licencia: formData.licencia,
          años_experiencia: formData.años_experiencia ? parseInt(formData.años_experiencia) : null,
          comision_promedio: formData.comision_promedio ? parseFloat(formData.comision_promedio) : null,
          
          // Estadísticas
          propiedades_activas: parseInt(formData.propiedades_activas),
          clientes_activos: parseInt(formData.clientes_activos),
          ventas_realizadas: parseInt(formData.ventas_realizadas),
          
          // Estado
          estatus: formData.estatus,
          notas: formData.notas
        }])
        .select();

      if (error) {
        throw error;
      }

      alert('Broker agregado correctamente!');
      router.push('/dashboard/brokers');
      
    } catch (error: any) {
      console.error('Error al agregar broker:', error);
      if (error.code === '23505') {
        alert('Error: Ya existe un broker con ese email');
      } else {
        alert('Error al agregar el broker');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Link 
              href="/dashboard/brokers"
              style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Volver a Brokers
            </Link>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
            Agregar Nuevo Broker
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Complete la información del nuevo broker o agente
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}>
            
            {/* Información Personal */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3436', marginBottom: '24px' }}>
                Información Personal
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Especialidad
                  </label>
                  <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'white'
                    }}
                  >
                    <option value="">Seleccionar especialidad</option>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Terrenos">Terrenos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3436', marginBottom: '24px' }}>
                Información Profesional
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Licencia
                  </label>
                  <input
                    type="text"
                    name="licencia"
                    value={formData.licencia}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Años de Experiencia
                  </label>
                  <input
                    type="number"
                    name="años_experiencia"
                    value={formData.años_experiencia}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                    Comisión Promedio (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="comision_promedio"
                    value={formData.comision_promedio}
                    onChange={handleChange}
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

            {/* Botones */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
              <Link
                href="/dashboard/brokers"
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#9ca3af' : '#181f42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Broker'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}