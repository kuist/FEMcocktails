const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Order extends Model {}

Order.init({
  userId: DataTypes.INTEGER,
  total: DataTypes.FLOAT,
  status: DataTypes.STRING
}, { sequelize, modelName: 'order' });

module.exports = Order;