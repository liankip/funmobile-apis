'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class reseller_toko extends Model {
        static associate(models) {
            reseller_toko.hasOne(models.reseller, {
                foreignKey: 'kode',
                as: 'reseller'
            })
        }
    };

    reseller_toko.init({
        kode_reseller: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        nama_toko: DataTypes.STRING,
        alamat_toko: DataTypes.STRING,
        tipe_toko: DataTypes.STRING,
        createdAt: DataTypes.STRING,
        updatedAt: DataTypes.STRING
    }, {
        timestamps: false,
        freezeTableName: true,
        sequelize,
        modelName: 'reseller_toko',
    });

    reseller_toko.sync({
        alter: false
    })

    reseller_toko.removeAttribute("id");

    reseller_toko.beforeCreate((instance, option) => {});

    return reseller_toko;
};