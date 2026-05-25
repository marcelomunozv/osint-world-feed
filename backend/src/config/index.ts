import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  useMocks: process.env.USE_MOCKS === 'true',

  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    db: process.env.POSTGRES_DB || 'osint_feed',
    user: process.env.POSTGRES_USER || 'osint_user',
    password: process.env.POSTGRES_PASSWORD || 'osint_pass_secure',
    get url() {
      return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.db}`
    },
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  apis: {
    newsapi: {
      key: process.env.NEWSAPI_KEY || '',
      baseUrl: 'https://newsapi.org/v2',
    },
    gdelt: {
      baseUrl: process.env.GDELT_API_URL || 'https://api.gdeltproject.org/api/v2',
    },
  },

  collector: {
    intervalMinutes: parseInt(process.env.COLLECTOR_INTERVAL_MINUTES || '5', 10),
    breakingIntervalSeconds: parseInt(process.env.BREAKING_NEWS_INTERVAL_SECONDS || '30', 10),
  },
}
