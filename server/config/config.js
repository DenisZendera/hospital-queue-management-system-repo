import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT Secrets - Different secrets for different user types
  jwt: {
    patientSecret: process.env.JWT_PATIENT_SECRET || 'patient-secret-key-change-in-production',
    staffSecret: process.env.JWT_STAFF_SECRET || 'staff-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // CORS Configuration
  cors: {
    // Allow requests from any local network IP address or localhost
    // This enables mobile access on any WiFi network without reconfiguration
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }

      // Allow any local network IP (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
      const localNetworkPattern = /^http:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}):\d+$/;
      if (localNetworkPattern.test(origin)) {
        return callback(null, true);
      }

      // Allow custom origins from environment variable
      if (process.env.CORS_ORIGIN) {
        const allowedOrigins = process.env.CORS_ORIGIN.split(',');
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
      }

      // Reject other origins
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // IP Whitelist for Admin/Staff Portal
  // In production, only allow hospital network IPs
  allowedStaffIPs: process.env.ALLOWED_STAFF_IPS
    ? process.env.ALLOWED_STAFF_IPS.split(',')
    : ['127.0.0.1', '::1', '::ffff:127.0.0.1'], // localhost for development

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: process.env.RATE_LIMIT_MAX || 1000 // Increased for development
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'good_health_hospital'
  }
};
