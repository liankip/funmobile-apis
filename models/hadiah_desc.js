'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hadiah_desc extends Model {
    static associate(models) {
        hadiah_desc.belongsTo(models.hadiah_poin, {
            foreignKey: "kode",
        })
    }
  };

  hadiah_desc.init({
    kode: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    h_desc: DataTypes.STRING,
    h_img: DataTypes.STRING,
		h_stock: DataTypes.INTEGER
  }, {
    timestamps: false,
    freezeTableName: true,
    sequelize,
    modelName: 'hadiah_desc',
  });
  hadiah_desc.sync({
    alter: false
  })
  hadiah_desc.removeAttribute("id");

  return hadiah_desc;
};