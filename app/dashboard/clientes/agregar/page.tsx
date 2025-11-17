// /dashboard/clientes/agregar/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgregarCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: 'comprador',
    nombre: '',
    email: '',
    telefono: '',
    presupuesto_min: '',
    presupuesto_max: '',
    intereses: [] as string[],
    estatus: 'activo',
    notas: ''
  });

  const tiposInteres = ['industrial', 'comercial', 'residencial'];

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
      const { error } = await supabase
        .from('clientes')
        .insert([{
          ...formData,
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
            
            {/* Tipo de Cliente */}
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
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
                <option value="ambos">Ambos</option>
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