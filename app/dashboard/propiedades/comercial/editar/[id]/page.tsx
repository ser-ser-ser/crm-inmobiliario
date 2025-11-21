'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function EditarPropiedadComercial() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeSection, setActiveSection] = useState('basica');
  const [userRole, setUserRole] = useState('');
  const [currentBrokerId, setCurrentBrokerId] = useState<string | null>(null);
  const [propiedadBrokerId, setPropiedadBrokerId] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  
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

  // Cargar datos y validar permisos
  useEffect(() => {
    if (id) {
      fetchPropiedadAndValidate();
    }
  }, [id]);

  const fetchPropiedadAndValidate = async () => {
    try {
      // Obtener información del usuario
      const userEmail = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole') || 'broker';
      setUserRole(role);

      let brokerId = null;

      // Si no es admin, obtener broker_id
      if (role !== 'admin' && role !== 'superadmin') {
        const { data: usuario, error: userError } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', userEmail)
          .single();

        if (userError) throw userError;
        brokerId = usuario?.broker_id;
        setCurrentBrokerId(brokerId);
      }

      // Cargar propiedad
      const { data: propiedad, error } = await supabase
        .from('propiedades_comerciales')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!propiedad) {
        setAccessDenied(true);
        return;
      }

      // Validar permisos: solo admin o el broker dueño puede editar
      if (role !== 'admin' && role !== 'superadmin' && propiedad.broker_id !== brokerId) {
        setAccessDenied(true);
        return;
      }

      setPropiedadBrokerId(propiedad.broker_id);

      // Cargar datos en el formulario
      if (propiedad) {
        setFormData({
          // INFORMACIÓN BÁSICA
          nombre_plaza: propiedad.nombre_plaza || '',
          ubicacion: propiedad.ubicacion || '',
          superficie_terreno: propiedad.superficie_terreno?.toString() || '',
          numero_locales: propiedad.numero_locales?.toString() || '',
          
          // ESTACIONAMIENTO
          cajones_estacionamiento: propiedad.cajones_estacionamiento?.toString() || '',
          motopuertos: propiedad.motopuertos?.toString() || '',
          ciclopuertos: propiedad.ciclopuertos?.toString() || '',
          
          // COMUNICACIÓN VERTICAL
          escaleras_estaticas: propiedad.escaleras_estaticas || '',
          escaleras_emergencia: propiedad.escaleras_emergencia || '',
          elevador: propiedad.elevador || '',
          
          // EQUIPO OPERATIVO Y SERVICIOS
          gas_lp: propiedad.gas_lp || '',
          gas_butano: propiedad.gas_butano || '',
          gas_natural: propiedad.gas_natural || '',
          agua: propiedad.agua || '',
          luz: propiedad.luz || '',
          extraccion_humo: propiedad.extraccion_humo || '',
          trampas_grasa: propiedad.trampas_grasa || '',
          equipo_bombero: propiedad.equipo_bombero || '',
          automatizacion_agua: propiedad.automatizacion_agua || '',
          capacidad_sisterna: propiedad.capacidad_sisterna || '',
          drenaje_publico: propiedad.drenaje_publico || '',
          paneles_solares: propiedad.paneles_solares || '',
          
          // CONECTIVIDAD
          transformador_bifasico: propiedad.transformador_bifasico || '',
          transformador_trifasico: propiedad.transformador_trifasico || '',
          centro_carga: propiedad.centro_carga || '',
          acceso_azotea: propiedad.acceso_azotea || '',
          acceso_trasero_pasillo_servicios: propiedad.acceso_trasero_pasillo_servicios || '',
          ducteria_voz_datos: propiedad.ducteria_voz_datos || '',
          
          // ENTREGA DEL LOCAL
          obra_gris: propiedad.obra_gris || '',
          obra_blanca: propiedad.obra_blanca || '',
          obra_negra: propiedad.obra_negra || '',
          concreto_pulido_piso: propiedad.concreto_pulido_piso || '',
          canalizacion_voz_datos: propiedad.canalizacion_voz_datos || '',
          preparacion_hidraulica_electrica_sanitaria: propiedad.preparacion_hidraulica_electrica_sanitaria || '',
          puertas_cristal_aluminio_ventanales: propiedad.puertas_cristal_aluminio_ventanales || '',
          muros_divisorios: propiedad.muros_divisorios || '',
          salida_hidrosanitarias: propiedad.salida_hidrosanitarias || '',
          acometida_electrica_telefonia_tv_subterranea: propiedad.acometida_electrica_telefonia_tv_subterranea || '',
          preparacion_drenaje_wc: propiedad.preparacion_drenaje_wc || '',
          preparacion_mini_split_aire_acondicionado: propiedad.preparacion_mini_split_aire_acondicionado || '',
          valvulas_linea_agua_potable: propiedad.valvulas_linea_agua_potable || '',
          interruptor_electrico_principal: propiedad.interruptor_electrico_principal || '',
          
          // INFORMACIÓN DEL INMUEBLE
          altura_piso_techo_planta_baja: propiedad.altura_piso_techo_planta_baja?.toString() || '',
          altura_piso_techo_planta_alta: propiedad.altura_piso_techo_planta_alta?.toString() || '',
          banos_publicos: propiedad.banos_publicos || '',
          circuito_cerrado: propiedad.circuito_cerrado || '',
          seguridad_24hrs: propiedad.seguridad_24hrs || '',
          modulo_administracion: propiedad.modulo_administracion || '',
          
          // DOCUMENTOS PARA ARRENDAMIENTOS
          reglamento_general_plaza: propiedad.reglamento_general_plaza || '',
          acta_entrega_local: propiedad.acta_entrega_local || '',
          totem_precios: propiedad.totem_precios || '',
          anuncio_luminoso_normal: propiedad.anuncio_luminoso_normal || '',
          reglamento_colocacion_anuncio: propiedad.reglamento_colocacion_anuncio || '',
          seguro_local: propiedad.seguro_local || '',
          
          // CONDICIONES DE ARRENDAMIENTO
          contrato_justicia_alternativa: propiedad.contrato_justicia_alternativa || '',
          investigacion: propiedad.investigacion || '',
          anos_forzoso_contrato: propiedad.anos_forzoso_contrato || '',
          anos_opcionales_contrato: propiedad.anos_opcionales_contrato || '',
          meses_renta_adelantada: propiedad.meses_renta_adelantada?.toString() || '',
          meses_deposito: propiedad.meses_deposito?.toString() || '',
          inpc: propiedad.inpc || '',
          meses_gracia: propiedad.meses_gracia?.toString() || '',
          mantenimiento: propiedad.mantenimiento || '',
          exclusividad_giro: propiedad.exclusividad_giro || '',
          entrega_locales: propiedad.entrega_locales || '',
          
          // PRECIOS Y RENTAS
          precio_venta: propiedad.precio_venta?.toString() || '',
          renta_mensual: propiedad.renta_mensual?.toString() || '',
          cuota_mantenimiento: propiedad.cuota_mantenimiento?.toString() || '',
          
          // OBSERVACIONES GENERALES
          observaciones_generales: propiedad.observaciones_generales || '',
          especificaciones_adicionales: propiedad.especificaciones_adicionales || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAccessDenied(true);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numericValue) ? null : numericValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('propiedades_comerciales')
        .update({
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
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      alert('Propiedad comercial actualizada correctamente!');
      router.push('/dashboard/propiedades/comercial');
      
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      alert('Error al actualizar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  // Si acceso denegado
  if (accessDenied) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3436', marginBottom: '16px' }}>
            Acceso Denegado
          </h1>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            No tienes permisos para editar esta propiedad.
          </p>
          <Link
            href="/dashboard/propiedades/comercial"
            style={{
              padding: '12px 24px',
              background: '#181f42',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Volver a Propiedades Comerciales
          </Link>
        </div>
      </div>
    );
  }

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
            <label 
              htmlFor="nombre_plaza"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Nombre de la Plaza *
            </label>
            <input
              type="text"
              id="nombre_plaza"
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
            <label 
              htmlFor="ubicacion"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
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
            <label 
              htmlFor="superficie_terreno"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Superficie de Terreno (m²)
            </label>
            <input
              type="number"
              id="superficie_terreno"
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
            <label 
              htmlFor="numero_locales"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Número de Locales
            </label>
            <input
              type="number"
              id="numero_locales"
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
            <label 
              htmlFor="cajones_estacionamiento"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Cajones de Estacionamiento
            </label>
            <input
              type="number"
              id="cajones_estacionamiento"
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
            <label 
              htmlFor="motopuertos"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Motopuertos
            </label>
            <input
              type="number"
              id="motopuertos"
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
            <label 
              htmlFor="ciclopuertos"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Ciclopuertos
            </label>
            <input
              type="number"
              id="ciclopuertos"
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
            <label 
              htmlFor="escaleras_estaticas"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Escaleras Estáticas
            </label>
            <input
              type="text"
              id="escaleras_estaticas"
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
            <label 
              htmlFor="escaleras_emergencia"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Escaleras de Emergencia
            </label>
            <input
              type="text"
              id="escaleras_emergencia"
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
            <label 
              htmlFor="elevador"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Elevador
            </label>
            <input
              type="text"
              id="elevador"
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
              <label 
                htmlFor={field.name}
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
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
              <label 
                htmlFor={field.name}
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
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
              <label 
                htmlFor={field.name}
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
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
            <label 
              htmlFor="altura_piso_techo_planta_baja"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Altura Piso-Techo Planta Baja (m)
            </label>
            <input
              type="number"
              id="altura_piso_techo_planta_baja"
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
            <label 
              htmlFor="altura_piso_techo_planta_alta"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Altura Piso-Techo Planta Alta (m)
            </label>
            <input
              type="number"
              id="altura_piso_techo_planta_alta"
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
              <label 
                htmlFor={field.name}
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
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
              <label 
                htmlFor={field.name}
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
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
              <label 
                htmlFor={field.name}
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
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
            <label 
              htmlFor="precio_venta"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Precio de Venta
            </label>
            <input
              type="text"
              id="precio_venta"
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
            <label 
              htmlFor="renta_mensual"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Renta Mensual
            </label>
            <input
              type="text"
              id="renta_mensual"
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
            <label 
              htmlFor="cuota_mantenimiento"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Cuota de Mantenimiento
            </label>
            <input
              type="text"
              id="cuota_mantenimiento"
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
            <label 
              htmlFor="observaciones_generales"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Observaciones Generales
            </label>
            <textarea
              id="observaciones_generales"
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
            <label 
              htmlFor="especificaciones_adicionales"
              style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' }}
            >
              Especificaciones Adicionales
            </label>
            <textarea
              id="especificaciones_adicionales"
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

  if (fetching) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Cargando propiedad...</div>
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
            Editar Propiedad Comercial
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Modifique la información de la propiedad comercial
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
              {loading ? 'Actualizando...' : 'Actualizar Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}