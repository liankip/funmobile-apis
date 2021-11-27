'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class reseller_save extends Model {
        static associate(models) {}
    };

    reseller_save.init({
        s_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        kode_reseller: DataTypes.STRING,
        nama: DataTypes.STRING,
        noTelp: DataTypes.STRING,
        s_stype: DataTypes.INTEGER,
        s_createdAt: DataTypes.STRING,
        s_updatedAt: DataTypes.STRING
    }, {
        timestamps: false,
        freezeTableName: true,
        sequelize,
        modelName: 'reseller_save',
    });

    reseller_save.sync({
        alter: false
    })

    reseller_save.removeAttribute("id");

    reseller_save.beforeCreate((instance, option) => {});

    return reseller_save;
};