'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function EditarPropiedadIndustrial() {
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
    // ... (todo el formData igual que antes)
    marca: '',
    giro_industrial: '',
    ubicacion_coordenadas: '',
    radio_expansion: '',
    accesos_conectividad: '',
    precio_mn: '',
    cuota_mantenimiento: '',
    total_renta_cuota: '',
    precio_m2: '',
    superficie_total: '',
    superficie_almacen: '',
    oficinas_m2: '',
    tipo_nave: '',
    altura_minima: '',
    año_construccion: '',
    capacidad_carga_piso: '',
    capacidad_electrica: '',
    tension_electrica: '',
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
    uso_suelo: '',
    documentacion_regla: '',
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
    especificaciones_adicionales: '',
    observaciones: ''
  });

  // Cargar datos y validar permisos - COPIADO DE COMERCIAL
  useEffect(() => {
    if (id) {
      fetchPropiedadAndValidate();
    }
  }, [id]);

  const fetchPropiedadAndValidate = async () => {
    try {
      // Obtener información del usuario (MISMO PATRÓN QUE COMERCIAL)
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
        .from('propiedades_industriales')
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
          marca: propiedad.marca || '',
          giro_industrial: propiedad.giro_industrial || '',
          ubicacion_coordenadas: propiedad.ubicacion_coordenadas || '',
          radio_expansion: propiedad.radio_expansion || '',
          accesos_conectividad: propiedad.accesos_conectividad || '',
          precio_mn: propiedad.precio_mn?.toString() || '',
          cuota_mantenimiento: propiedad.cuota_mantenimiento?.toString() || '',
          total_renta_cuota: propiedad.total_renta_cuota?.toString() || '',
          precio_m2: propiedad.precio_m2?.toString() || '',
          superficie_total: propiedad.superficie_total?.toString() || '',
          superficie_almacen: propiedad.superficie_almacen?.toString() || '',
          oficinas_m2: propiedad.oficinas_m2?.toString() || '',
          tipo_nave: propiedad.tipo_nave || '',
          altura_minima: propiedad.altura_minima?.toString() || '',
          año_construccion: propiedad.año_construccion?.toString() || '',
          capacidad_carga_piso: propiedad.capacidad_carga_piso?.toString() || '',
          capacidad_electrica: propiedad.capacidad_electrica?.toString() || '',
          tension_electrica: propiedad.tension_electrica || '',
          conectividad_fibra: propiedad.conectividad_fibra || 'No',
          energia_renovable: propiedad.energia_renovable || 'No',
          aislante_techo: propiedad.aislante_techo || 'No',
          tragaluz_natural: propiedad.tragaluz_natural || 'No',
          sistema_extraccion: propiedad.sistema_extraccion || 'No',
          andenes_carga: propiedad.andenes_carga || 'No',
          sellos_andenes: propiedad.sellos_andenes || 'No',
          rampas_nivel: propiedad.rampas_nivel || 'No',
          iluminacion_led: propiedad.iluminacion_led || 'No',
          sistema_incendio: propiedad.sistema_incendio || 'No',
          uso_suelo: propiedad.uso_suelo || '',
          documentacion_regla: propiedad.documentacion_regla || '',
          banos_vestidores: propiedad.banos_vestidores || 'No',
          regaderas: propiedad.regaderas || 'No',
          comedor: propiedad.comedor || 'No',
          accesos_independientes: propiedad.accesos_independientes || 'No',
          caseta_seguridad: propiedad.caseta_seguridad || 'No',
          estacionamiento: propiedad.estacionamiento || 'No',
          terreno_camiones: propiedad.terreno_camiones || 'No',
          rutas_transporte: propiedad.rutas_transporte || 'No',
          servicios_agua: propiedad.servicios_agua || 'No',
          via_ferrocarril: propiedad.via_ferrocarril || 'No',
          total_pallet: propiedad.total_pallet || '',
          especificaciones_adicionales: propiedad.especificaciones_adicionales || '',
          observaciones: propiedad.observaciones || ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('propiedades_industriales')
        .update({
          // ... (todo el update igual que antes)
          marca: formData.marca,
          giro_industrial: formData.giro_industrial,
          ubicacion_coordenadas: formData.ubicacion_coordenadas,
          radio_expansion: formData.radio_expansion,
          accesos_conectividad: formData.accesos_conectividad,
          precio_mn: formData.precio_mn ? parseFloat(formData.precio_mn) : null,
          cuota_mantenimiento: formData.cuota_mantenimiento ? parseFloat(formData.cuota_mantenimiento) : null,
          total_renta_cuota: formData.total_renta_cuota ? parseFloat(formData.total_renta_cuota) : null,
          precio_m2: formData.precio_m2 ? parseFloat(formData.precio_m2) : null,
          superficie_total: formData.superficie_total ? parseFloat(formData.superficie_total) : null,
          superficie_almacen: formData.superficie_almacen ? parseFloat(formData.superficie_almacen) : null,
          oficinas_m2: formData.oficinas_m2 ? parseFloat(formData.oficinas_m2) : null,
          tipo_nave: formData.tipo_nave,
          altura_minima: formData.altura_minima ? parseFloat(formData.altura_minima) : null,
          año_construccion: formData.año_construccion ? parseInt(formData.año_construccion) : null,
          capacidad_carga_piso: formData.capacidad_carga_piso ? parseFloat(formData.capacidad_carga_piso) : null,
          capacidad_electrica: formData.capacidad_electrica ? parseFloat(formData.capacidad_electrica) : null,
          tension_electrica: formData.tension_electrica,
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
          uso_suelo: formData.uso_suelo,
          documentacion_regla: formData.documentacion_regla,
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
          especificaciones_adicionales: formData.especificaciones_adicionales,
          observaciones: formData.observaciones
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      alert('Propiedad industrial actualizada correctamente!');
      router.push('/dashboard/propiedades/industrial');
      
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      alert('Error al actualizar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  // Si acceso denegado - COPIADO DE COMERCIAL
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
            href="/dashboard/propiedades/industrial"
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
            Volver a Propiedades Industriales
          </Link>
        </div>
      </div>
    );
  }

  // ... (el resto del código con sections y renderSection se mantiene IGUAL)
  const sections = [
    { id: 'basica', label: 'Información Básica', icon: '📋' },
    { id: 'tecnicas', label: 'Especificaciones Técnicas', icon: '🏗️' },
    { id: 'instalaciones', label: 'Instalaciones', icon: '⚡' },
    { id: 'documentacion', label: 'Documentación', icon: '📄' },
    { id: 'servicios', label: 'Servicios', icon: '🚚' },
    { id: 'observaciones', label: 'Observaciones', icon: '📝' }
  ];

  const renderSection = () => {
    // ... (todo el renderSection IGUAL que antes)
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
            {/* ... resto de campos básicos IGUAL */}
          </div>
        );
      // ... resto de cases IGUAL
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
    // ... (el return completo IGUAL que antes)
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '32px' }}>
      {/* ... todo el JSX IGUAL */}
    </div>
  );
}