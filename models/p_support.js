'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class p_support extends Model {
		static associate(models) {}
	};

	p_support.init({
		code_support: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title_support: DataTypes.STRING,
		url_support: DataTypes.STRING,
		contact_support: DataTypes.STRING,
		link_support: DataTypes.STRING,
		createdAt: DataTypes.STRING,
		updatedAt: DataTypes.STRING
	}, {
		timestamps: false,
		freezeTableName: true,
		sequelize,
		modelName: 'p_support',
	});

	p_support.sync({ alter: false })

	p_support.removeAttribute("id");

	return p_support;
};