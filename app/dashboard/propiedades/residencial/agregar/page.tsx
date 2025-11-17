// /dashboard/propiedades/residencial/agregar/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgregarPropiedadResidencial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basica');
  
  const [formData, setFormData] = useState({
    // INFORMACIÓN BÁSICA
    titulo: '',
    direccion: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigo_postal: '',
    tipo_propiedad: 'casa',
    
    // PRECIOS
    precio_venta: '',
    precio_renta: '',
    
    // CARACTERÍSTICAS PRINCIPALES
    superficie_terreno: '',
    superficie_construccion: '',
    habitaciones: '',
    banos: '',
    medios_banos: '',
    niveles: '',
    antiguedad: '',
    cocheras: '',
    
    // COMODIDADES
    jardin: false,
    alberca: false,
    seguridad_24hrs: false,
    amueblado: false,
    aire_acondicionado: false,
    calefaccion: false,
    
    // ÁREAS COMUNES
    gimnasio: false,
    salon_eventos: false,
    areas_verdes: false,
    parque_infantil: false,
    
    // INFORMACIÓN ADICIONAL
    descripcion: '',
    estatus: 'disponible',
    destacado: false
  });

  const sections = [
    { id: 'basica', label: 'Información Básica', icon: '📋' },
    { id: 'precios', label: 'Precios', icon: '💰' },
    { id: 'caracteristicas', label: 'Características', icon: '🏠' },
    { id: 'comodidades', label: 'Comodidades', icon: '⭐' },
    { id: 'adicional', label: 'Información Adicional', icon: '📝' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('propiedades_residenciales')
        .insert([{
          // INFORMACIÓN BÁSICA
          titulo: formData.titulo,
          direccion: formData.direccion,
          colonia: formData.colonia,
          ciudad: formData.ciudad,
          estado: formData.estado,
          codigo_postal: formData.codigo_postal,
          tipo_propiedad: formData.tipo_propiedad,
          
          // PRECIOS
          precio_venta: formData.precio_venta ? parseFloat(formData.precio_venta) : null,
          precio_renta: formData.precio_renta ? parseFloat(formData.precio_renta) : null,
          
          // CARACTERÍSTICAS PRINCIPALES
          superficie_terreno: formData.superficie_terreno ? parseFloat(formData.superficie_terreno) : null,
          superficie_construccion: formData.superficie_construccion ? parseFloat(formData.superficie_construccion) : null,
          habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : null,
          banos: formData.banos ? parseInt(formData.banos) : null,
          medios_banos: formData.medios_banos ? parseInt(formData.medios_banos) : null,
          niveles: formData.niveles ? parseInt(formData.niveles) : null,
          antiguedad: formData.antiguedad ? parseInt(formData.antiguedad) : null,
          cocheras: formData.cocheras ? parseInt(formData.cocheras) : null,
          
          // COMODIDADES
          jardin: formData.jardin,
          alberca: formData.alberca,
          seguridad_24hrs: formData.seguridad_24hrs,
          amueblado: formData.amueblado,
          aire_acondicionado: formData.aire_acondicionado,
          calefaccion: formData.calefaccion,
          
          // ÁREAS COMUNES
          gimnasio: formData.gimnasio,
          salon_eventos: formData.salon_eventos,
          areas_verdes: formData.areas_verdes,
          parque_infantil: formData.parque_infantil,
          
          // INFORMACIÓN ADICIONAL
          descripcion: formData.descripcion,
          estatus: formData.estatus,
          destacado: formData.destacado
        }]);

      if (error) {
  console.error('Error de Supabase:', error);
  alert(`Error: ${error.message}`);
  throw error;
}

      alert('Propiedad residencial agregada correctamente!');
      router.push('/dashboard/propiedades/residencial');
      
    } catch (error) {
      console.error('Error agregando propiedad:', error);
      alert('Error al agregar propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'basica':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
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
                Tipo de Propiedad *
              </label>
              <select
                name="tipo_propiedad"
                value={formData.tipo_propiedad}
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
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="duplex">Duplex</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
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
                Colonia
              </label>
              <input
                type="text"
                name="colonia"
                value={formData.colonia}
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
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
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
                Estado
              </label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
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
        );

      case 'precios':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Precio de Venta
              </label>
              <input
                type="number"
                name="precio_venta"
                value={formData.precio_venta}
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
                Precio de Renta
              </label>
              <input
                type="number"
                name="precio_renta"
                value={formData.precio_renta}
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
        );

      case 'caracteristicas':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { name: 'superficie_terreno', label: 'Superficie Terreno (m²)', type: 'number' },
              { name: 'superficie_construccion', label: 'Superficie Construcción (m²)', type: 'number' },
              { name: 'habitaciones', label: 'Habitaciones', type: 'number' },
              { name: 'banos', label: 'Baños Completos', type: 'number' },
              { name: 'medios_banos', label: 'Medios Baños', type: 'number' },
              { name: 'niveles', label: 'Niveles', type: 'number' },
              { name: 'antiguedad', label: 'Antigüedad (años)', type: 'number' },
              { name: 'cocheras', label: 'Cocheras', type: 'number' }
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData] as string}
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
            ))}
          </div>
        );

      case 'comodidades':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { name: 'jardin', label: 'Jardín' },
              { name: 'alberca', label: 'Alberca' },
              { name: 'seguridad_24hrs', label: 'Seguridad 24hrs' },
              { name: 'amueblado', label: 'Amueblado' },
              { name: 'aire_acondicionado', label: 'Aire Acondicionado' },
              { name: 'calefaccion', label: 'Calefacción' },
              { name: 'gimnasio', label: 'Gimnasio' },
              { name: 'salon_eventos', label: 'Salón de Eventos' },
              { name: 'areas_verdes', label: 'Áreas Verdes' },
              { name: 'parque_infantil', label: 'Parque Infantil' }
            ].map((field) => (
              <div key={field.name} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name as keyof typeof formData] as boolean}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                <label style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'adicional':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
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
                <option value="disponible">Disponible</option>
                <option value="vendido">Vendido</option>
                <option value="rentado">Rentado</option>
                <option value="en_proceso">En Proceso</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="destacado"
                checked={formData.destacado}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <label style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Propiedad Destacada
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={6}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Descripción detallada de la propiedad..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Link 
              href="/dashboard/propiedades/residencial"
              style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Volver a Propiedades Residenciales
            </Link>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
            Agregar Propiedad Residencial
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Complete la información de la nueva propiedad residencial
          </p>
        </div>

        {/* Navegación por secciones */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: activeSection === section.id ? '#181f42' : 'white',
                color: activeSection === section.id ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3436', marginBottom: '24px' }}>
              {sections.find(s => s.id === activeSection)?.label}
            </h2>
            
            {renderSection()}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <Link
              href="/dashboard/propiedades/residencial"
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
              {loading ? 'Agregando...' : 'Agregar Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}