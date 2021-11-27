'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class reseller_data extends Model {
		static associate(models) {
			reseller_data.belongsTo(models.reseller, {
				foreignKey: 'kode_reseller',
				targetKey: 'kode'
			})
		}
	};

	reseller_data.init({
		data_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		kode_reseller: DataTypes.STRING,
		device_id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		device_multi: DataTypes.INTEGER,
		device_act: DataTypes.INTEGER,
		reseller_img: DataTypes.STRING,
		createdAt: DataTypes.STRING,
		updatedAt: DataTypes.STRING
	}, {
		timestamps: false,
		freezeTableName: true,
		sequelize,
		modelName: 'reseller_data',
	});

	reseller_data.sync({
		alter: false
	})

	reseller_data.removeAttribute("id");

	reseller_data.beforeCreate((instance, option) => {});

	return reseller_data;
};