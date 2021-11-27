'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tiket_response extends Model {
    static associate(models) {
      tiket_response.belongsTo(models.tiket_deposit, {
        foreignKey: 'kode_tiketdeposit'
      });
    }
  };

  tiket_response.init({
    kode: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    kode_tiketdeposit: DataTypes.STRING,
    rc: DataTypes.INTEGER,
    rd: DataTypes.STRING,
    request_time: DataTypes.STRING,
    reff_id: DataTypes.STRING,
    payment_code: DataTypes.STRING,
    order_id: DataTypes.STRING,
    request_key: DataTypes.STRING,
    url_listener: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_methodcode: DataTypes.STRING,
    fee_admin: DataTypes.INTEGER,
    total_amount: DataTypes.INTEGER,
    spi_statusurl: DataTypes.STRING,
    response_time: DataTypes.STRING,
    expired_time: DataTypes.STRING,
    tips: DataTypes.INTEGER,
    nominal_mdr: DataTypes.INTEGER,
    image_qr: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'tiket_response',
    freezeTableName: true,
    timestamps: false
  });

  tiket_response.sync({
    alter: false
  })

  tiket_response.removeAttribute('id')

  return tiket_response;
};