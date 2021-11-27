'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class p_info extends Model {
		static associate(models) {}
	};

	p_info.init({
		code_info: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name_info: DataTypes.STRING,
		img_info: DataTypes.STRING,
		desc_info: DataTypes.STRING,
		content_info: DataTypes.STRING,
		created_at: DataTypes.STRING,
		updated_at: DataTypes.STRING
	}, {
		timestamps: false,
		freezeTableName: true,
		sequelize,
		modelName: 'p_info',
	});

	p_info.sync({ alter: false })

	p_info.removeAttribute("id");

	return p_info;
};