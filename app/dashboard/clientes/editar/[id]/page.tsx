'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditarClientePage() {
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'comprador',
    estatus: 'activo',
    etapa_pipeline: 'prospecto',
    probabilidad_cierre: 10,
    presupuesto_max: '',
    notas: ''
  });

  useEffect(() => {
    loadCliente();
  }, [id]);

  const loadCliente = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setCliente(data);
      setFormData({
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono || '',
        tipo: data.tipo || 'comprador',
        estatus: data.estatus || 'activo',
        etapa_pipeline: data.etapa_pipeline || 'prospecto',
        probabilidad_cierre: data.probabilidad_cierre || 10,
        presupuesto_max: data.presupuesto_max || '',
        notas: data.notas || ''
      });

    } catch (error: any) {
      console.error('Error loading client:', error);
      alert('Error al cargar cliente: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          ...formData,
          presupuesto_max: formData.presupuesto_max ? parseFloat(formData.presupuesto_max) : null
        })
        .eq('id', id);

      if (error) throw error;

      alert('Cliente actualizado exitosamente!');
      router.push('/dashboard/clientes');
      
    } catch (error: any) {
      console.error('Error updating client:', error);
      alert('Error al actualizar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!cliente) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Cargando cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px' }}>Editar Cliente</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Editando: {cliente.nombre}</p>
          </div>
          <Link href="/dashboard/clientes" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>← Volver</Link>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <h3 style={{ marginBottom: '15px', color: '#374151' }}>Información Básica</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Nombre Completo *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Teléfono</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Presupuesto Máximo</label>
                    <input type="number" name="presupuesto_max" value={formData.presupuesto_max} onChange={handleChange} placeholder="Ej: 5000000" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '15px', color: '#374151' }}>Clasificación</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Tipo</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                      <option value="comprador">Comprador</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="inversionista">Inversionista</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Estatus</label>
                    <select name="estatus" value={formData.estatus} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="prospecto">Prospecto</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Etapa Pipeline</label>
                    <select name="etapa_pipeline" value={formData.etapa_pipeline} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                      <option value="prospecto">Prospecto (10%)</option>
                      <option value="calificado">Calificado (30%)</option>
                      <option value="negociacion">Negociación (70%)</option>
                      <option value="cerrado">Cerrado (100%)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Notas Adicionales</label>
                <textarea name="notas" value={formData.notas} onChange={handleChange} rows={4} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <Link href="/dashboard/clientes" style={{ padding: '12px 24px', background: '#6b7280', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Cancelar</Link>
                <button type="submit" disabled={loading} style={{ padding: '12px 24px', background: '#181f42', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Actualizando...' : 'Actualizar Cliente'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}