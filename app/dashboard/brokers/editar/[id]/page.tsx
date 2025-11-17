'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Broker {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  licencia: string;
  años_experiencia: number;
  comision_promedio: number;
  estatus: string;
}

export default function EditarBrokerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: 'residencial',
    licencia: '',
    años_experiencia: 0,
    comision_promedio: 0,
    estatus: 'activo'
  });

  useEffect(() => {
    if (id) {
      fetchBroker();
    }
  }, [id]);

  const fetchBroker = async () => {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setBroker(data);
      setFormData({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || '',
        especialidad: data.especialidad || 'residencial',
        licencia: data.licencia || '',
        años_experiencia: data.años_experiencia || 0,
        comision_promedio: data.comision_promedio || 0,
        estatus: data.estatus || 'activo'
      });
    } catch (error) {
      console.error('Error fetching broker:', error);
      alert('Error al cargar el broker');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const { error } = await supabase
        .from('brokers')
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      alert('Broker actualizado correctamente');
      router.push('/dashboard/brokers');
    } catch (error) {
      console.error('Error updating broker:', error);
      alert('Error al actualizar el broker');
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
              Editar Broker
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              Actualizar información del broker
            </p>
          </div>
          <Link
            href="/dashboard/brokers"
            style={{
              padding: '10px 20px',
              background: '#6b7280',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Volver
          </Link>
        </div>

        {/* Form */}
        <div style={{ 
          background: 'white', 
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
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
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Especialidad
                </label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Licencia
                </label>
                <input
                  type="text"
                  name="licencia"
                  value={formData.licencia}
                  onChange={handleInputChange}
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Años Experiencia
                </label>
                <input
                  type="number"
                  name="años_experiencia"
                  value={formData.años_experiencia}
                  onChange={handleInputChange}
                  min="0"
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Comisión Promedio (%)
                </label>
                <input
                  type="number"
                  name="comision_promedio"
                  value={formData.comision_promedio}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={formData.estatus}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <Link
                href="/dashboard/brokers"
                style={{
                  padding: '12px 24px',
                  background: '#6b7280',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={guardando}
                style={{
                  padding: '12px 24px',
                  background: '#181f42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: guardando ? 'not-allowed' : 'pointer'
                }}
              >
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}