const Usuario = require('./Usuario');
const Donante = require('./Donante');
const Producto = require('./Producto');
const Beneficiario = require('./Beneficiario');
const Donacion = require('./Donacion');
const Entrega = require('./Entrega');
const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Tabla intermedia DonacionProducto
const DonacionProducto = sequelize.define('DonacionProducto', {
  donacion_id: {
    type: DataTypes.INTEGER,
    references: { model: Donacion, key: 'id' }
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: { model: Producto, key: 'id' }
  }
}, { tableName: 'donacion_productos', timestamps: false });

// Tabla intermedia EntregaProducto
const EntregaProducto = sequelize.define('EntregaProducto', {
  entrega_id: {
    type: DataTypes.INTEGER,
    references: { model: Entrega, key: 'id' }
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: { model: Producto, key: 'id' }
  }
}, { tableName: 'entrega_productos', timestamps: false });

// Relaciones
Usuario.hasMany(Donacion, { foreignKey: 'usuario_id' });
Donacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Donante.hasMany(Donacion, { foreignKey: 'donante_id' });
Donacion.belongsTo(Donante, { foreignKey: 'donante_id' });

Donacion.belongsToMany(Producto, { through: DonacionProducto, foreignKey: 'donacion_id' });
Producto.belongsToMany(Donacion, { through: DonacionProducto, foreignKey: 'producto_id' });

Beneficiario.hasMany(Entrega, { foreignKey: 'beneficiario_id' });
Entrega.belongsTo(Beneficiario, { foreignKey: 'beneficiario_id' });

Entrega.belongsToMany(Producto, { through: EntregaProducto, foreignKey: 'entrega_id' });
Producto.belongsToMany(Entrega, { through: EntregaProducto, foreignKey: 'producto_id' });

module.exports = {
  sequelize,
  Usuario,
  Donante,
  Producto,
  Beneficiario,
  Donacion,
  Entrega,
  DonacionProducto,
  EntregaProducto
};