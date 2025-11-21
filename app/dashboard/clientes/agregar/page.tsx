// /dashboard/clientes/agregar/page.tsx - VERSIÓN CORREGIDA
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgregarCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Obtener email del usuario logueado
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);
  }, []);

  // TIPOS EXPANDIDOS
  const tiposCliente = [
    'Propietario/Vendedor',
    'Comprador/Inversionista', 
    'Arrendador',
    'Arrendatario',
    'Inquilino',
    'Promotor',
    'Tercerizado'
  ];

  const tiposOperacion = ['compra', 'venta', 'renta'];
  const tiposPropiedad = ['residencial', 'comercial', 'industrial'];
  const tiposInteres = ['industrial', 'comercial', 'residencial'];

  const [formData, setFormData] = useState({
    tipo: 'Propietario/Vendedor', // ← VALOR INICIAL CORRECTO
    nombre: '',
    email: '',
    telefono: '',
    presupuesto_min: '',
    presupuesto_max: '',
    intereses: [] as string[],
    propiedades_interes: [] as string[],
    tipo_operacion: 'compra',
    requerimientos_especificos: '',
    estatus: 'activo',
    notas: ''
  });

  const handleInteresChange = (interes: string) => {
    setFormData(prev => ({
      ...prev,
      intereses: prev.intereses.includes(interes)
        ? prev.intereses.filter(i => i !== interes)
        : [...prev.intereses, interes]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Obtener broker_id del usuario logueado
      let brokerId = null;
      if (userEmail) {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', userEmail)
          .single();
        
        brokerId = usuario?.broker_id;
      }

      const { error } = await supabase
        .from('clientes')
        .insert([{
          ...formData,
          broker_id: brokerId,
          presupuesto_min: formData.presupuesto_min ? parseFloat(formData.presupuesto_min) : null,
          presupuesto_max: formData.presupuesto_max ? parseFloat(formData.presupuesto_max) : null
        }]);

      if (error) throw error;

      alert('Cliente agregado correctamente!');
      router.push('/dashboard/clientes');
      
    } catch (error) {
      console.error('Error agregando cliente:', error);
      alert('Error al agregar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link 
            href="/dashboard/clientes"
            style={{ 
              color: '#64748b', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '16px',
              display: 'inline-block'
            }}
          >
            ← Volver a Clientes
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
            Agregar Cliente
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Complete la información del nuevo cliente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            
            {/* Tipo de Cliente - CORREGIDO */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Tipo de Cliente *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              >
                {tiposCliente.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Información Básica */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
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
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={formData.estatus}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="activo">Activo</option>
                  <option value="prospecto">Prospecto</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Contacto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  Email
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
            </div>

            {/* Presupuesto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  Presupuesto Mínimo
                </label>
                <input
                  type="number"
                  name="presupuesto_min"
                  value={formData.presupuesto_min}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  Presupuesto Máximo
                </label>
                <input
                  type="number"
                  name="presupuesto_max"
                  value={formData.presupuesto_max}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Intereses */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Intereses en Propiedades
              </label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {tiposInteres.map(interes => (
                  <label key={interes} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.intereses.includes(interes)}
                      onChange={() => handleInteresChange(interes)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{interes}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Propiedades de Interés - NUEVO */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Tipos de Propiedad de Interés
              </label>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {tiposPropiedad.map(tipo => (
                  <label key={tipo} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.propiedades_interes.includes(tipo)}
                      onChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          propiedades_interes: prev.propiedades_interes.includes(tipo)
                            ? prev.propiedades_interes.filter(p => p !== tipo)
                            : [...prev.propiedades_interes, tipo]
                        }))
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de Operación - NUEVO */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Tipo de Operación Deseada
              </label>
              <select
                name="tipo_operacion"
                value={formData.tipo_operacion}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                {tiposOperacion.map(op => (
                  <option key={op} value={op}>
                    {op === 'compra' ? 'Compra' : op === 'venta' ? 'Venta' : 'Renta'}
                  </option>
                ))}
              </select>
            </div>

            {/* Requerimientos Específicos - NUEVO */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Requerimientos Específicos
              </label>
              <textarea
                name="requerimientos_especificos"
                value={formData.requerimientos_especificos}
                onChange={handleChange}
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Ej: Necesito bodega con altura mínima de 8m, oficinas de 50m², acceso para tráileres..."
              />
            </div>

            {/* Notas */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Notas Adicionales
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Observaciones, preferencias específicas, etc."
              />
            </div>

          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <Link
              href="/dashboard/clientes"
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
              {loading ? 'Agregando...' : 'Agregar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}