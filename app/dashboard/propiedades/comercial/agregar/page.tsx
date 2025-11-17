'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function AgregarPropiedadComercial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basica');
  
  const [formData, setFormData] = useState({
    // INFORMACIÓN BÁSICA
    nombre_plaza: '',
    ubicacion: '',
    superficie_terreno: '',
    numero_locales: '',
    
    // ESTACIONAMIENTO
    cajones_estacionamiento: '',
    motopuertos: '',
    ciclopuertos: '',
    
    // COMUNICACIÓN VERTICAL
    escaleras_estaticas: '',
    escaleras_emergencia: '',
    elevador: '',
    
    // EQUIPO OPERATIVO Y SERVICIOS
    gas_lp: '',
    gas_butano: '',
    gas_natural: '',
    agua: '',
    luz: '',
    extraccion_humo: '',
    trampas_grasa: '',
    equipo_bombero: '',
    automatizacion_agua: '',
    capacidad_sisterna: '',
    drenaje_publico: '',
    paneles_solares: '',
    
    // CONECTIVIDAD
    transformador_bifasico: '',
    transformador_trifasico: '',
    centro_carga: '',
    acceso_azotea: '',
    acceso_trasero_pasillo_servicios: '',
    ducteria_voz_datos: '',
    
    // ENTREGA DEL LOCAL
    obra_gris: '',
    obra_blanca: '',
    obra_negra: '',
    concreto_pulido_piso: '',
    canalizacion_voz_datos: '',
    preparacion_hidraulica_electrica_sanitaria: '',
    puertas_cristal_aluminio_ventanales: '',
    muros_divisorios: '',
    salida_hidrosanitarias: '',
    acometida_electrica_telefonia_tv_subterranea: '',
    preparacion_drenaje_wc: '',
    preparacion_mini_split_aire_acondicionado: '',
    valvulas_linea_agua_potable: '',
    interruptor_electrico_principal: '',
    
    // INFORMACIÓN DEL INMUEBLE
    altura_piso_techo_planta_baja: '',
    altura_piso_techo_planta_alta: '',
    banos_publicos: '',
    circuito_cerrado: '',
    seguridad_24hrs: '',
    modulo_administracion: '',
    
    // DOCUMENTOS PARA ARRENDAMIENTOS
    reglamento_general_plaza: '',
    acta_entrega_local: '',
    totem_precios: '',
    anuncio_luminoso_normal: '',
    reglamento_colocacion_anuncio: '',
    seguro_local: '',
    
    // CONDICIONES DE ARRENDAMIENTO
    contrato_justicia_alternativa: '',
    investigacion: '',
    anos_forzoso_contrato: '',
    anos_opcionales_contrato: '',
    meses_renta_adelantada: '',
    meses_deposito: '',
    inpc: '',
    meses_gracia: '',
    mantenimiento: '',
    exclusividad_giro: '',
    entrega_locales: '',
    
    // PRECIOS Y RENTAS
    precio_venta: '',
    renta_mensual: '',
    cuota_mantenimiento: '',
    
    // OBSERVACIONES GENERALES
    observaciones_generales: '',
    especificaciones_adicionales: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (value: string) => {
    // Remover comas existentes y convertir a número
    const numericValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numericValue) ? null : numericValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('propiedades_comerciales')
        .insert([{
          // INFORMACIÓN BÁSICA
          nombre_plaza: formData.nombre_plaza,
          ubicacion: formData.ubicacion,
          superficie_terreno: formData.superficie_terreno ? parseFloat(formData.superficie_terreno) : null,
          numero_locales: formData.numero_locales ? parseInt(formData.numero_locales) : null,
          
          // ESTACIONAMIENTO
          cajones_estacionamiento: formData.cajones_estacionamiento ? parseInt(formData.cajones_estacionamiento) : null,
          motopuertos: formData.motopuertos ? parseInt(formData.motopuertos) : null,
          ciclopuertos: formData.ciclopuertos ? parseInt(formData.ciclopuertos) : null,
          
          // COMUNICACIÓN VERTICAL
          escaleras_estaticas: formData.escaleras_estaticas,
          escaleras_emergencia: formData.escaleras_emergencia,
          elevador: formData.elevador,
          
          // EQUIPO OPERATIVO Y SERVICIOS
          gas_lp: formData.gas_lp,
          gas_butano: formData.gas_butano,
          gas_natural: formData.gas_natural,
          agua: formData.agua,
          luz: formData.luz,
          extraccion_humo: formData.extraccion_humo,
          trampas_grasa: formData.trampas_grasa,
          equipo_bombero: formData.equipo_bombero,
          automatizacion_agua: formData.automatizacion_agua,
          capacidad_sisterna: formData.capacidad_sisterna,
          drenaje_publico: formData.drenaje_publico,
          paneles_solares: formData.paneles_solares,
          
          // CONECTIVIDAD
          transformador_bifasico: formData.transformador_bifasico,
          transformador_trifasico: formData.transformador_trifasico,
          centro_carga: formData.centro_carga,
          acceso_azotea: formData.acceso_azotea,
          acceso_trasero_pasillo_servicios: formData.acceso_trasero_pasillo_servicios,
          ducteria_voz_datos: formData.ducteria_voz_datos,
          
          // ENTREGA DEL LOCAL
          obra_gris: formData.obra_gris,
          obra_blanca: formData.obra_blanca,
          obra_negra: formData.obra_negra,
          concreto_pulido_piso: formData.concreto_pulido_piso,
          canalizacion_voz_datos: formData.canalizacion_voz_datos,
          preparacion_hidraulica_electrica_sanitaria: formData.preparacion_hidraulica_electrica_sanitaria,
          puertas_cristal_aluminio_ventanales: formData.puertas_cristal_aluminio_ventanales,
          muros_divisorios: formData.muros_divisorios,
          salida_hidrosanitarias: formData.salida_hidrosanitarias,
          acometida_electrica_telefonia_tv_subterranea: formData.acometida_electrica_telefonia_tv_subterranea,
          preparacion_drenaje_wc: formData.preparacion_drenaje_wc,
          preparacion_mini_split_aire_acondicionado: formData.preparacion_mini_split_aire_acondicionado,
          valvulas_linea_agua_potable: formData.valvulas_linea_agua_potable,
          interruptor_electrico_principal: formData.interruptor_electrico_principal,
          
          // INFORMACIÓN DEL INMUEBLE
          altura_piso_techo_planta_baja: formData.altura_piso_techo_planta_baja ? parseFloat(formData.altura_piso_techo_planta_baja) : null,
          altura_piso_techo_planta_alta: formData.altura_piso_techo_planta_alta ? parseFloat(formData.altura_piso_techo_planta_alta) : null,
          banos_publicos: formData.banos_publicos,
          circuito_cerrado: formData.circuito_cerrado,
          seguridad_24hrs: formData.seguridad_24hrs,
          modulo_administracion: formData.modulo_administracion,
          
          // DOCUMENTOS PARA ARRENDAMIENTOS
          reglamento_general_plaza: formData.reglamento_general_plaza,
          acta_entrega_local: formData.acta_entrega_local,
          totem_precios: formData.totem_precios,
          anuncio_luminoso_normal: formData.anuncio_luminoso_normal,
          reglamento_colocacion_anuncio: formData.reglamento_colocacion_anuncio,
          seguro_local: formData.seguro_local,
          
          // CONDICIONES DE ARRENDAMIENTO
          contrato_justicia_alternativa: formData.contrato_justicia_alternativa,
          investigacion: formData.investigacion,
          anos_forzoso_contrato: formData.anos_forzoso_contrato,
          anos_opcionales_contrato: formData.anos_opcionales_contrato,
          meses_renta_adelantada: formData.meses_renta_adelantada ? parseInt(formData.meses_renta_adelantada) : null,
          meses_deposito: formData.meses_deposito ? parseInt(formData.meses_deposito) : null,
          inpc: formData.inpc,
          meses_gracia: formData.meses_gracia ? parseInt(formData.meses_gracia) : null,
          mantenimiento: formData.mantenimiento,
          exclusividad_giro: formData.exclusividad_giro,
          entrega_locales: formData.entrega_locales,
          
          // PRECIOS Y RENTAS
          precio_venta: formatCurrency(formData.precio_venta),
          renta_mensual: formatCurrency(formData.renta_mensual),
          cuota_mantenimiento: formatCurrency(formData.cuota_mantenimiento),
          
          // OBSERVACIONES GENERALES
          observaciones_generales: formData.observaciones_generales,
          especificaciones_adicionales: formData.especificaciones_adicionales
        }])
        .select();

      if (error) {
        throw error;
      }

      alert('Propiedad comercial agregada correctamente!');
      router.push('/dashboard/propiedades/comercial');
      
    } catch (error) {
      console.error('Error al agregar propiedad:', error);
      alert('Error al agregar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basica', label: 'Información Básica', icon: '📋' },
    { id: 'estacionamiento', label: 'Estacionamiento', icon: '🚗' },
    { id: 'comunicacion', label: 'Comunicación Vertical', icon: '🛗' },
    { id: 'equipo', label: 'Equipo Operativo', icon: '⚙️' },
    { id: 'conectividad', label: 'Conectividad', icon: '🔌' },
    { id: 'entrega', label: 'Entrega del Local', icon: '🏗️' },
    { id: 'inmueble', label: 'Información del Inmueble', icon: '🏢' },
    { id: 'documentos', label: 'Documentos', icon: '📄' },
    { id: 'condiciones', label: 'Condiciones', icon: '📝' },
    { id: 'precios', label: 'Precios y Rentas', icon: '💰' },
    { id: 'observaciones', label: 'Observaciones', icon: '📋' }
  ];

const renderSection = () => {
  switch(activeSection) {
    case 'basica':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Nombre de la Plaza *
            </label>
            <input
              type="text"
              name="nombre_plaza"
              value={formData.nombre_plaza}
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
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
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
              Superficie de Terreno (m²)
            </label>
            <input
              type="number"
              step="0.01"
              name="superficie_terreno"
              value={formData.superficie_terreno}
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
              Número de Locales
            </label>
            <input
              type="number"
              name="numero_locales"
              value={formData.numero_locales}
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

    case 'estacionamiento':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Cajones de Estacionamiento
            </label>
            <input
              type="number"
              name="cajones_estacionamiento"
              value={formData.cajones_estacionamiento}
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
              Motopuertos
            </label>
            <input
              type="number"
              name="motopuertos"
              value={formData.motopuertos}
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
              Ciclopuertos
            </label>
            <input
              type="number"
              name="ciclopuertos"
              value={formData.ciclopuertos}
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

    case 'comunicacion':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Escaleras Estáticas
            </label>
            <input
              type="text"
              name="escaleras_estaticas"
              value={formData.escaleras_estaticas}
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
              Escaleras de Emergencia
            </label>
            <input
              type="text"
              name="escaleras_emergencia"
              value={formData.escaleras_emergencia}
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
              Elevador
            </label>
            <input
              type="text"
              name="elevador"
              value={formData.elevador}
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

    case 'equipo':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { name: 'gas_lp', label: 'Gas LP' },
            { name: 'gas_butano', label: 'Gas Butano' },
            { name: 'gas_natural', label: 'Gas Natural' },
            { name: 'agua', label: 'Agua' },
            { name: 'luz', label: 'Luz' },
            { name: 'extraccion_humo', label: 'Extracción de Humo' },
            { name: 'trampas_grasa', label: 'Trampas de Grasa' },
            { name: 'equipo_bombero', label: 'Equipo de Bombero' },
            { name: 'automatizacion_agua', label: 'Automatización de Agua' },
            { name: 'capacidad_sisterna', label: 'Capacidad de Cisterna (Lts)' },
            { name: 'drenaje_publico', label: 'Drenaje Público' },
            { name: 'paneles_solares', label: 'Paneles Solares' }
          ].map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                {field.label}
              </label>
              <input
                type="text"
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

    case 'conectividad':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { name: 'transformador_bifasico', label: 'Transformador Bifásico' },
            { name: 'transformador_trifasico', label: 'Transformador Trifásico' },
            { name: 'centro_carga', label: 'Centro de Carga' },
            { name: 'acceso_azotea', label: 'Acceso a Azotea' },
            { name: 'acceso_trasero_pasillo_servicios', label: 'Acceso Trasero a Pasillo de Servicios' },
            { name: 'ducteria_voz_datos', label: 'Ductería para Voz y Datos' }
          ].map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                {field.label}
              </label>
              <input
                type="text"
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

    case 'entrega':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { name: 'obra_gris', label: 'Obra Gris' },
            { name: 'obra_blanca', label: 'Obra Blanca' },
            { name: 'obra_negra', label: 'Obra Negra' },
            { name: 'concreto_pulido_piso', label: 'Concreto Pulido en Piso' },
            { name: 'canalizacion_voz_datos', label: 'Canalización para Voz y Datos' },
            { name: 'preparacion_hidraulica_electrica_sanitaria', label: 'Preparación Hidráulica, Eléctrica y Sanitaria' },
            { name: 'puertas_cristal_aluminio_ventanales', label: 'Puertas de Cristal/Aluminio y Ventanales' },
            { name: 'muros_divisorios', label: 'Muros Divisorios' },
            { name: 'salida_hidrosanitarias', label: 'Salida de Hidrosanitarias' },
            { name: 'acometida_electrica_telefonia_tv_subterranea', label: 'Acometida Eléctrica, Telefonía y TV Subterránea' },
            { name: 'preparacion_drenaje_wc', label: 'Preparación para Drenaje de WC' },
            { name: 'preparacion_mini_split_aire_acondicionado', label: 'Preparación para Mini Split/Aire Acondicionado' },
            { name: 'valvulas_linea_agua_potable', label: 'Válvulas en Línea de Agua Potable' },
            { name: 'interruptor_electrico_principal', label: 'Interruptor Eléctrico Principal' }
          ].map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                {field.label}
              </label>
              <input
                type="text"
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

    case 'inmueble':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Altura Piso-Techo Planta Baja (m)
            </label>
            <input
              type="number"
              step="0.01"
              name="altura_piso_techo_planta_baja"
              value={formData.altura_piso_techo_planta_baja}
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
              Altura Piso-Techo Planta Alta (m)
            </label>
            <input
              type="number"
              step="0.01"
              name="altura_piso_techo_planta_alta"
              value={formData.altura_piso_techo_planta_alta}
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

          {[
            { name: 'banos_publicos', label: 'Baños Públicos' },
            { name: 'circuito_cerrado', label: 'Circuito Cerrado' },
            { name: 'seguridad_24hrs', label: 'Seguridad 24hrs' },
            { name: 'modulo_administracion', label: 'Módulo de Administración' }
          ].map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                {field.label}
              </label>
              <input
                type="text"
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

    case 'documentos':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { name: 'reglamento_general_plaza', label: 'Reglamento General de la Plaza' },
            { name: 'acta_entrega_local', label: 'Acta de Entrega del Local' },
            { name: 'totem_precios', label: 'Tótem de Precios' },
            { name: 'anuncio_luminoso_normal', label: 'Anuncio Luminoso/Normal' },
            { name: 'reglamento_colocacion_anuncio', label: 'Reglamento de Colocación de Anuncio' },
            { name: 'seguro_local', label: 'Seguro del Local' }
          ].map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                {field.label}
              </label>
              <input
                type="text"
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

    case 'condiciones':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { name: 'contrato_justicia_alternativa', label: 'Contrato por Justicia Alternativa' },
            { name: 'investigacion', label: 'Investigación' },
            { name: 'anos_forzoso_contrato', label: 'Años Forzoso del Contrato' },
            { name: 'anos_opcionales_contrato', label: 'Años Opcionales del Contrato' },
            { name: 'meses_renta_adelantada', label: 'Meses de Renta Adelantada' },
            { name: 'meses_deposito', label: 'Meses de Depósito' },
            { name: 'inpc', label: 'INPC' },
            { name: 'meses_gracia', label: 'Meses de Gracia' },
            { name: 'mantenimiento', label: 'Mantenimiento' },
            { name: 'exclusividad_giro', label: 'Exclusividad de Giro' },
            { name: 'entrega_locales', label: 'Entrega de Locales' }
          ].map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                {field.label}
              </label>
              <input
                type="text"
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

    case 'precios':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
              Precio de Venta
            </label>
            <input
              type="text"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              placeholder="50,000.00"
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
              Renta Mensual
            </label>
            <input
              type="text"
              name="renta_mensual"
              value={formData.renta_mensual}
              onChange={handleChange}
              placeholder="25,000.00"
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
              Cuota de Mantenimiento
            </label>
            <input
              type="text"
              name="cuota_mantenimiento"
              value={formData.cuota_mantenimiento}
              onChange={handleChange}
              placeholder="2,500.00"
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
              Observaciones Generales
            </label>
            <textarea
              name="observaciones_generales"
              value={formData.observaciones_generales}
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
        </div>
      );

    default:
      return (
        <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
          <p>Sección en desarrollo - Próximamente más campos</p>
        </div>
      );
  }
};

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Link 
              href="/dashboard/propiedades/comercial"
              style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Volver a Propiedades Comerciales
            </Link>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', marginBottom: '8px' }}>
            Agregar Propiedad Comercial
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Complete la información de la nueva propiedad comercial
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
              href="/dashboard/propiedades/comercial"
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
        </form>
      </div>
    </div>
  );
}