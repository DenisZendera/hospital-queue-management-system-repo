import { exec, query, close, testConnection } from './config/database.js';

console.log('🔧 Fixing activity_logs table to support account_deleted action type...\n');

async function fixActivityLogs() {
  try {
    console.log('🔗 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    console.log('✅ Database connected\n');

    console.log('📊 Backing up activity_logs data...');
    const existingLogs = await query('SELECT * FROM activity_logs');
    console.log(`   Found ${existingLogs.length} existing log entries\n`);

    console.log('🔄 Recreating activity_logs table with updated constraints...');
    await exec(`
      -- Drop the old table
      DROP TABLE IF EXISTS activity_logs;

      -- Create the new table with account_deleted action type included
      CREATE TABLE activity_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_role TEXT NOT NULL CHECK(user_role IN ('patient', 'doctor', 'admin', 'superadmin')),
        action_type TEXT NOT NULL CHECK(action_type IN ('login', 'logout', 'profile_update', 'password_change', '2fa_enable', '2fa_disable', 'account_created', 'account_deleted', 'appointment_booked', 'message_sent')),
        action_description TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Recreate the index
      CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
    `);

    console.log('✅ Table recreated successfully\n');

    if (existingLogs.length > 0) {
      console.log('📥 Restoring backed up data...');
      for (const log of existingLogs) {
        await query(
          `INSERT INTO activity_logs (log_id, user_id, user_role, action_type, action_description, ip_address, user_agent, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            log.log_id,
            log.user_id,
            log.user_role,
            log.action_type,
            log.action_description,
            log.ip_address,
            log.user_agent,
            log.created_at
          ]
        );
      }
      console.log(`   ✅ Restored ${existingLogs.length} log entries\n`);
    }

    console.log('🎉 Activity logs table fixed successfully!');
    console.log('✅ Patient account deletion should now work correctly\n');

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  } finally {
    await close();
  }
}

fixActivityLogs();
