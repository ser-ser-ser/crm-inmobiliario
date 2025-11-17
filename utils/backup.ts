// utils/backup.ts - SISTEMA DE BACKUP
export const hacerBackup = () => {
  try {
    const backupData = {
      fecha: new Date().toISOString(),
      usuarios: localStorage.getItem('usuariosRegistrados'),
      clientes: localStorage.getItem('clientesData'),
      brokers: localStorage.getItem('brokersData'),
      propiedades: localStorage.getItem('propiedadesData')
    };
    
    const backupKey = 'backup_' + Date.now();
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    
    // Mantener solo los últimos 5 backups
    const backups = Object.keys(localStorage)
      .filter(key => key.startsWith('backup_'))
      .sort()
      .reverse()
      .slice(5);
      
    backups.forEach(key => localStorage.removeItem(key));
    
    console.log('✅ Backup creado:', backupKey);
    return backupKey;
  } catch (error) {
    console.error('❌ Error creando backup:', error);
    return null;
  }
};

export const restaurarBackup = (backupKey: string) => {
  try {
    const backup = localStorage.getItem(backupKey);
    if (backup) {
      const data = JSON.parse(backup);
      
      // Restaurar cada dato si existe
      if (data.usuarios) localStorage.setItem('usuariosRegistrados', data.usuarios);
      if (data.clientes) localStorage.setItem('clientesData', data.clientes);
      if (data.brokers) localStorage.setItem('brokersData', data.brokers);
      if (data.propiedades) localStorage.setItem('propiedadesData', data.propiedades);
      
      console.log('✅ Backup restaurado:', backupKey);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error restaurando backup:', error);
    return false;
  }
};

export const listarBackups = () => {
  return Object.keys(localStorage)
    .filter(key => key.startsWith('backup_'))
    .sort()
    .reverse()
    .map(key => {
      const backup = localStorage.getItem(key);
      return {
        key,
        fecha: backup ? JSON.parse(backup).fecha : 'Desconocida'
      };
    });
};

export const eliminarBackup = (backupKey: string) => {
  localStorage.removeItem(backupKey);
  console.log('🗑️ Backup eliminado:', backupKey);
};