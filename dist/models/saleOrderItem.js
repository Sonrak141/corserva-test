'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sequelize_1 = require('sequelize');
const index_1 = __importDefault(require('./index'));
class SaleOrderItem extends sequelize_1.Model {}
SaleOrderItem.init(
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    sale: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    quantity: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: sequelize_1.DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize: index_1.default,
    modelName: 'SaleOrderItem',
  },
);
exports.default = SaleOrderItem;
