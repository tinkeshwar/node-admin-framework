import dotenv from 'dotenv';
dotenv.config();

interface IDBConfig {
  username?: string;
  password?: string;
  database: string;
  host: string;
  dialect: string;
  migrationStorage: string;
  migrationStorageTableName: string;
  seederStorage: string;
  seederStorageTableName: string;
  pool?: any;
  dialectOptions?: any;
}

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOSTNAME,
} = process.env;


const commonConfig: IDBConfig = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME || 'vidhyasaga_admin_dev',
  host: DB_HOSTNAME || '127.0.0.1',
  dialect: 'mysql',
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_migrations',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seeders',

};

export const development = Object.assign({}, commonConfig, {
  database: DB_NAME || 'vidhyasaga_admin_dev'
}) as IDBConfig;
export const production = Object.assign({}, commonConfig, {
  database: DB_NAME || 'vidhyasaga_admin'
}) as IDBConfig;