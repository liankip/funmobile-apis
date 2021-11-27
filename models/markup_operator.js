"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class markup_operator extends Model {
    static associate(models) {
      markup_operator.belongsTo(models.reseller, {
        foreignKey: "kode_reseller",
				as: "reseller"
      });
      markup_operator.belongsTo(models.operator, {
        foreignKey: "kode_operator",
      });
    }
  }

  markup_operator.init(
    {
      _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      kode_reseller: DataTypes.STRING,
      kode_operator: DataTypes.STRING,
      markup: DataTypes.STRING,
      tgl_data: DataTypes.STRING,
    },
    {
      timestamps: false,
      freezeTableName: true,
      sequelize,
      modelName: "markup_operator",
    }
    );

    markup_operator.sync({
      alter: false,
    });

    markup_operator.removeAttribute("id");

    return markup_operator;
  };
