const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Beneficiario = sequelize.define('Beneficiario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'beneficiarios',
  timestamps: true
});

module.exports = Beneficiario;