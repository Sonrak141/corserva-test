'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
const sequelize = new sequelize_1.Sequelize(
  process.env.DB_NAME || 'sales_db',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  },
);
exports.default = sequelize;
