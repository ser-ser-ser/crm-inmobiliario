'use client';
import { hacerBackup, listarBackups, restaurarBackup } from '@/utils/backup';

export default function BackupTest() {
  const testBackup = () => {
    hacerBackup();
    const backups = listarBackups();
    console.log('Backups:', backups);
  };

  return (
    <div>
      <button onClick={testBackup}>Probar Backup</button>
    </div>
  );
}