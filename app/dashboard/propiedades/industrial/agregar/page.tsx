'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function AgregarPropiedadIndustrial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basica');
  const [currentBrokerId, setCurrentBrokerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // INFORMACIÓN BÁSICA
    marca: '',
    giro_industrial: '',
    ubicacion_coordenadas: '',
    radio_expansion: '',
    accesos_conectividad: '',
    precio_mn: '',
    cuota_mantenimiento: '',
    total_renta_cuota: '',
    precio_m2: '',

    // ESPECIFICACIONES TÉCNICAS
    superficie_total: '',
    superficie_almacen: '',
    oficinas_m2: '',
    tipo_nave: '',
    altura_minima: '',
    año_construccion: '',
    capacidad_carga_piso: '',
    capacidad_electrica: '',
    tension_electrica: '',

    // INSTALACIONES Y SERVICIOS
    conectividad_fibra: 'No',
    energia_renovable: 'No',
    aislante_techo: 'No',
    tragaluz_natural: 'No',
    sistema_extraccion: 'No',
    andenes_carga: 'No',
    sellos_andenes: 'No',
    rampas_nivel: 'No',
    iluminacion_led: 'No',
    sistema_incendio: 'No',

    // DOCUMENTACIÓN
    uso_suelo: '',
    documentacion_regla: '',

    // SERVICIOS COMPLEMENTARIOS
    banos_vestidores: 'No',
    regaderas: 'No',
    comedor: 'No',
    accesos_independientes: 'No',
    caseta_seguridad: 'No',
    estacionamiento: 'No',
    terreno_camiones: 'No',
    rutas_transporte: 'No',
    servicios_agua: 'No',
    via_ferrocarril: 'No',
    total_pallet: '',

    // OBSERVACIONES
    especificaciones_adicionales: '',
    observaciones: ''
  });

  // Obtener broker_id del usuario logueado
  useEffect(() => {
    const getCurrentBroker = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole') || 'broker';

        if (!userEmail || role === 'admin' || role === 'superadmin') {
          return; // Admin no necesita broker_id automático
        }

        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', userEmail)
          .single();

        if (error) throw error;
        setCurrentBrokerId(usuario?.broker_id || null);
      } catch (error) {
        console.error('Error obteniendo broker:', error);
      }
    };

    getCurrentBroker();
  }, []);

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
      const propiedadData = {
        // INFORMACIÓN BÁSICA
        marca: formData.marca,
        giro_industrial: formData.giro_industrial,
        ubicacion_coordenadas: formData.ubicacion_coordenadas,
        radio_expansion: formData.radio_expansion,
        accesos_conectividad: formData.accesos_conectividad,
        precio_mn: formData.precio_mn ? parseFloat(formData.precio_mn) : null,
        cuota_mantenimiento: formData.cuota_mantenimiento ? parseFloat(formData.cuota_mantenimiento) : null,
        total_renta_cuota: formData.total_renta_cuota ? parseFloat(formData.total_renta_cuota) : null,
        precio_m2: formData.precio_m2 ? parseFloat(formData.precio_m2) : null,

        // ESPECIFICACIONES TÉCNICAS
        superficie_total: formData.superficie_total ? parseFloat(formData.superficie_total) : null,
        superficie_almacen: formData.superficie_almacen ? parseFloat(formData.superficie_almacen) : null,
        oficinas_m2: formData.oficinas_m2 ? parseFloat(formData.oficinas_m2) : null,
        tipo_nave: formData.tipo_nave,
        altura_minima: formData.altura_minima ? parseFloat(formData.altura_minima) : null,
        año_construccion: formData.año_construccion ? parseInt(formData.año_construccion) : null,
        capacidad_carga_piso: formData.capacidad_carga_piso ? parseFloat(formData.capacidad_carga_piso) : null,
        capacidad_electrica: formData.capacidad_electrica ? parseFloat(formData.capacidad_electrica) : null,
        tension_electrica: formData.tension_electrica,

        // INSTALACIONES Y SERVICIOS
        conectividad_fibra: formData.conectividad_fibra,
        energia_renovable: formData.energia_renovable,
        aislante_techo: formData.aislante_techo,
        tragaluz_natural: formData.tragaluz_natural,
        sistema_extraccion: formData.sistema_extraccion,
        andenes_carga: formData.andenes_carga,
        sellos_andenes: formData.sellos_andenes,
        rampas_nivel: formData.rampas_nivel,
        iluminacion_led: formData.iluminacion_led,
        sistema_incendio: formData.sistema_incendio,

        // DOCUMENTACIÓN
        uso_suelo: formData.uso_suelo,
        documentacion_regla: formData.documentacion_regla,

        // SERVICIOS COMPLEMENTARIOS
        banos_vestidores: formData.banos_vestidores,
        regaderas: formData.regaderas,
        comedor: formData.comedor,
        accesos_independientes: formData.accesos_independientes,
        caseta_seguridad: formData.caseta_seguridad,
        estacionamiento: formData.estacionamiento,
        terreno_camiones: formData.terreno_camiones,
        rutas_transporte: formData.rutas_transporte,
        servicios_agua: formData.servicios_agua,
        via_ferrocarril: formData.via_ferrocarril,
        total_pallet: formData.total_pallet,

        // OBSERVACIONES
        especificaciones_adicionales: formData.especificaciones_adicionales,
        observaciones: formData.observaciones,

        // AGREGAR BROKER_ID AUTOMÁTICAMENTE
        broker_id: currentBrokerId
      };

      const { data, error } = await supabase
        .from('propiedades_industriales')
        .insert([propiedadData])
        .select();

      if (error) {
        throw error;
      }

      alert('Propiedad industrial agregada correctamente!');
      router.push('/dashboard/propiedades/industrial');
      
    } catch (error) {
      console.error('Error al agregar propiedad:', error);
      alert('Error al agregar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basica', label: 'Información Básica', icon: '📋' },
    { id: 'tecnicas', label: 'Especificaciones Técnicas', icon: '🏗️' },
    { id: 'instalaciones', label: 'Instalaciones', icon: '⚡' },
    { id: 'documentacion', label: 'Documentación', icon: '📄' },
    { id: 'servicios', label: 'Servicios', icon: '🚚' },
    { id: 'observaciones', label: 'Observaciones', icon: '📝' }
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'basica':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Marca/Nombre *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
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
                Giro Industrial
              </label>
              <input
                type="text"
                name="giro_industrial"
                value={formData.giro_industrial}
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
                Coordenadas Ubicación
              </label>
              <input
                type="text"
                name="ubicacion_coordenadas"
                value={formData.ubicacion_coordenadas}
                onChange={handleChange}
                placeholder="19.432608,-99.133209"
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
                Radio de Expansión
              </label>
              <input
                type="text"
                name="radio_expansion"
                value={formData.radio_expansion}
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
                Accesos y Conectividad
              </label>
              <input
                type="text"
                name="accesos_conectividad"
                value={formData.accesos_conectividad}
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
                Precio (MXN)
              </label>
              <input
                type="number"
                step="0.01"
                name="precio_mn"
                value={formData.precio_mn}
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
                Cuota Mantenimiento
              </label>
              <input
                type="number"
                step="0.01"
                name="cuota_mantenimiento"
                value={formData.cuota_mantenimiento}
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
                Precio por m²
              </label>
              <input
                type="number"
                step="0.01"
                name="precio_m2"
                value={formData.precio_m2}
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

      case 'tecnicas':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Superficie Total (m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="superficie_total"
                value={formData.superficie_total}
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
                Superficie Almacén (m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="superficie_almacen"
                value={formData.superficie_almacen}
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
                Oficinas (m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="oficinas_m2"
                value={formData.oficinas_m2}
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
                Tipo de Nave
              </label>
              <input
                type="text"
                name="tipo_nave"
                value={formData.tipo_nave}
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
                Altura Mínima (m)
              </label>
              <input
                type="number"
                step="0.01"
                name="altura_minima"
                value={formData.altura_minima}
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
                Año de Construcción
              </label>
              <input
                type="number"
                name="año_construccion"
                value={formData.año_construccion}
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
                Capacidad Carga Piso (kg/m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="capacidad_carga_piso"
                value={formData.capacidad_carga_piso}
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
                Capacidad Eléctrica (kVA)
              </label>
              <input
                type="number"
                step="0.01"
                name="capacidad_electrica"
                value={formData.capacidad_electrica}
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
                Tensión Eléctrica
              </label>
              <input
                type="text"
                name="tension_electrica"
                value={formData.tension_electrica}
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

      case 'instalaciones':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { name: 'conectividad_fibra', label: 'Conectividad Fibra Óptica' },
              { name: 'energia_renovable', label: 'Energía Renovable' },
              { name: 'aislante_techo', label: 'Aislante en Techo' },
              { name: 'tragaluz_natural', label: 'Tragaluz Natural' },
              { name: 'sistema_extraccion', label: 'Sistema de Extracción' },
              { name: 'andenes_carga', label: 'Andenes de Carga' },
              { name: 'sellos_andenes', label: 'Sellos en Andenes' },
              { name: 'rampas_nivel', label: 'Rampas a Nivel' },
              { name: 'iluminacion_led', label: 'Iluminación LED' },
              { name: 'sistema_incendio', label: 'Sistema Contra Incendio' }
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  {field.label}
                </label>
                <select
                  name={field.name}
                  value={formData[field.name as keyof typeof formData] as string}
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
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>
            ))}
          </div>
        );

      case 'documentacion':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Uso de Suelo
              </label>
              <input
                type="text"
                name="uso_suelo"
                value={formData.uso_suelo}
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
                Documentación en Regla
              </label>
              <input
                type="text"
                name="documentacion_regla"
                value={formData.documentacion_regla}
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

      case 'servicios':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { name: 'banos_vestidores', label: 'Baños y Vestidores' },
              { name: 'regaderas', label: 'Regaderas' },
              { name: 'comedor', label: 'Comedor' },
              { name: 'accesos_independientes', label: 'Accesos Independientes' },
              { name: 'caseta_seguridad', label: 'Caseta de Seguridad' },
              { name: 'estacionamiento', label: 'Estacionamiento' },
              { name: 'terreno_camiones', label: 'Terreno para Camiones' },
              { name: 'rutas_transporte', label: 'Rutas de Transporte' },
              { name: 'servicios_agua', label: 'Servicios de Agua' },
              { name: 'via_ferrocarril', label: 'Vía de Ferrocarril' }
            ].map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                  {field.label}
                </label>
                <select
                  name={field.name}
                  value={formData[field.name as keyof typeof formData] as string}
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
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>
            ))}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Total de Pallets
              </label>
              <input
                type="text"
                name="total_pallet"
                value={formData.total_pallet}
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

      case 'observaciones':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Especificaciones Adicionales
              </label>
              <textarea
                name="especificaciones_adicionales"
                value={formData.especificaciones_adicionales}
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
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
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
              href="/dashboard/propiedades/industrial"
              style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Volver a Propiedades Industriales
            </Link>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
            Agregar Propiedad Industrial
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Complete la información de la nueva propiedad industrial
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
                padding: '12px 20px',
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
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              {sections.map((section, index) => (
                activeSection !== section.id && (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: 'white',
                      color: '#374151',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {section.icon}
                  </button>
                )
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link
                href="/dashboard/propiedades/industrial"
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
                {loading ? 'Guardando...' : 'Guardar Propiedad'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}