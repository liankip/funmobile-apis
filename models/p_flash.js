'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class p_flash extends Model {
		static associate(models) {}
	};

	p_flash.init({
		code_flash: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title_flash: DataTypes.STRING,
		desc_flash: DataTypes.STRING,
		img_flash: DataTypes.STRING,
		link_flash: DataTypes.STRING,
		start_flash: DataTypes.STRING,
		end_flash: DataTypes.STRING,
		type_flash: DataTypes.STRING,
		status_flash: DataTypes.STRING
	}, {
		timestamps: false,
		freezeTableName: true,
		sequelize,
		modelName: 'p_flash',
	});

	p_flash.sync({ alter: false })

	p_flash.removeAttribute("id");

	return p_flash;
};