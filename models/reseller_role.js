'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class reseller_role extends Model {
		static associate(models) {}
	};

	reseller_role.init({
		R_ID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		R_Name: DataTypes.STRING,
		R_Username: DataTypes.STRING,
		R_Password: DataTypes.STRING,
		R_Role: DataTypes.STRING,
		R_Status: DataTypes.INTEGER,
		createdAt: DataTypes.STRING,
		updatedAt: DataTypes.STRING
	}, {
		timestamps: false,
		freezeTableName: true,
		sequelize,
		modelName: 'reseller_role',
	});

	reseller_role.sync({
		alter: false
	})

	reseller_role.removeAttribute("id");

	reseller_role.beforeCreate((instance, option) => {});

	return reseller_role;
};