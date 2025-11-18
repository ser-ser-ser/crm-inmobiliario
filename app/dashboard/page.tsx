// app/dashboard/page.tsx - DASHBOARD INTELIGENTE
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './dashboard.css';

interface DashboardStats {
  totalPropiedades: number;
  propiedadesResidenciales: number;
  propiedadesComerciales: number;
  propiedadesIndustriales: number;
  totalClientes: number;
  clientesActivos: number;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalPropiedades: 0,
    propiedadesResidenciales: 0,
    propiedadesComerciales: 0,
    propiedadesIndustriales: 0,
    totalClientes: 0,
    clientesActivos: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserAndStats();
  }, []);

  const loadUserAndStats = async () => {
    try {
      // Cargar datos del usuario
      const email = localStorage.getItem('userEmail');
      if (!email) {
        router.push('/login');
        return;
      }

      const name = localStorage.getItem('userName') || 'Usuario';
      const role = localStorage.getItem('userRole') || 'broker';
      
      setUserName(name);
      setUserEmail(email);
      setUserRole(role);

      // Cargar estadísticas según el rol
      await loadDashboardStats(email, role);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async (userEmail: string, role: string) => {
    try {
      let residencialCount = 0;
      let comercialCount = 0;
      let industrialCount = 0;
      let clientesCount = 0;
      let clientesActivosCount = 0;

      if (role === 'admin' || role === 'superadmin') {
        // ADMIN ve todo
        const [
          { count: resCount },
          { count: comCount },
          { count: indCount },
          { data: clientesData }
        ] = await Promise.all([
          supabase.from('propiedades_residenciales').select('id', { count: 'exact' }),
          supabase.from('propiedades_comerciales').select('id', { count: 'exact' }),
          supabase.from('propiedades_industriales').select('id', { count: 'exact' }),
          supabase.from('clientes').select('id, estatus', { count: 'exact' })
        ]);

        residencialCount = resCount || 0;
        comercialCount = comCount || 0;
        industrialCount = indCount || 0;
        clientesCount = clientesData?.length || 0;
        clientesActivosCount = clientesData?.filter(c => c.estatus === 'activo').length || 0;

      } else {
        // BROKER ve solo sus datos
        // Primero obtener el broker_id del usuario
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('broker_id')
          .eq('email', userEmail)
          .single();

        if (usuario?.broker_id) {
          const [
            { count: resCount },
            { count: comCount },
            { count: indCount },
            { data: clientesData }
          ] = await Promise.all([
            supabase.from('propiedades_residenciales').select('id', { count: 'exact' }).eq('broker_id', usuario.broker_id),
            supabase.from('propiedades_comerciales').select('id', { count: 'exact' }).eq('broker_id', usuario.broker_id),
            supabase.from('propiedades_industriales').select('id', { count: 'exact' }).eq('broker_id', usuario.broker_id),
            supabase.from('clientes').select('id, estatus', { count: 'exact' }).eq('broker_id', usuario.broker_id)
          ]);

          residencialCount = resCount || 0;
          comercialCount = comCount || 0;
          industrialCount = indCount || 0;
          clientesCount = clientesData?.length || 0;
          clientesActivosCount = clientesData?.filter(c => c.estatus === 'activo').length || 0;
        }
      }

      setStats({
        totalPropiedades: residencialCount + comercialCount + industrialCount,
        propiedadesResidenciales: residencialCount,
        propiedadesComerciales: comercialCount,
        propiedadesIndustriales: industrialCount,
        totalClientes: clientesCount,
        clientesActivos: clientesActivosCount
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ fontSize: '1.2rem' }}>Cargando dashboard inteligente...</p>
        </div>
      </div>
    );
  }

  // Tarjetas base para todos los usuarios
  const baseCards = [
    { 
      href: '/dashboard/propiedades/residencial', 
      title: '🏠 Residencial', 
      desc: `${stats.propiedadesResidenciales} propiedades`, 
      color: '#DC2626',
      count: stats.propiedadesResidenciales
    },
    { 
      href: '/dashboard/propiedades/comercial', 
      title: '🛍️ Comercial', 
      desc: `${stats.propiedadesComerciales} propiedades`, 
      color: '#059669',
      count: stats.propiedadesComerciales
    },
    { 
      href: '/dashboard/propiedades/industrial', 
      title: '🏭 Industrial', 
      desc: `${stats.propiedadesIndustriales} propiedades`, 
      color: '#4F46E5',
      count: stats.propiedadesIndustriales
    },
    { 
      href: '/dashboard/clientes', 
      title: '👥 Clientes', 
      desc: `${stats.totalClientes} clientes (${stats.clientesActivos} activos)`, 
      color: '#7C3AED',
      count: stats.totalClientes
    },
    { 
      href: '/dashboard/reportes', 
      title: '📊 Pipeline', 
      desc: 'Seguimiento de ventas', 
      color: '#0891B2'
    },
  ];

  // Tarjeta especial para brokers (su perfil)
  const brokerCard = {
    href: 'perfil', 
    title: '👤 Mi Perfil', 
    desc: 'Gestionar mi información', 
    color: '#EA580C'
  };

  // Tarjeta especial para administradores (gestión de usuarios)
  const adminCard = {
    href: '/dashboard/admin/usuarios', 
    title: '👥 Gestión Usuarios', 
    desc: userRole === 'admin' ? 'Ver todos los usuarios' : 'Gestionar roles y permisos', 
    color: '#7C3AED'
  };

  // Combinar tarjetas según el rol
  let cards = [...baseCards];
  
  if (userRole === 'broker') {
    cards.push(brokerCard);
  } else if (userRole === 'admin' || userRole === 'superadmin') {
  cards.push(adminCard);
  cards.push(brokerCard);  // ← SOLO ESTA LÍNEA, NADA MÁS
}

  // Mostrar rol correcto en el header
  const getRoleDisplay = () => {
    switch (userRole) {
      case 'superadmin': return '👑 Super Administrador';
      case 'admin': return '💼 Administrador del Sistema';
      case 'broker': return '🤝 Broker CRM';
      default: return 'Usuario';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #181f42ff 0%, #252730ff 100%)',
      padding: '40px 20px'
    }}>
      {/* Header con usuario */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '8px' }}>
            Bienvenido, {userName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '4px' }}>
            {userEmail}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            {getRoleDisplay()}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {(userRole === 'admin' || userRole === 'superadmin') && (
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '12px 20px', 
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalPropiedades}</div>
              <div style={{ fontSize: '0.8rem', opacity: '0.8' }}>Total Propiedades</div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tarjetas del dashboard */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        {cards.map((card, index) => (
          <Link key={index} href={card.href} style={cardStyle}>
            <div style={{ 
              background: card.color, 
              width: '60px', 
              height: '60px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              {card.title.split(' ')[0]}
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#1F2937' }}>
              {card.title.split(' ').slice(1).join(' ')}
              {card.count !== undefined && (
                <span style={{ 
                  marginLeft: '8px', 
                  background: card.color, 
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {card.count}
                </span>
              )}
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.5' }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '30px',
  borderRadius: '16px',
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  cursor: 'pointer'
};