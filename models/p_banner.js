'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class p_banner extends Model {
		static associate(models) {}
	};

	p_banner.init({
		code_banner: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name_banner: DataTypes.STRING,
		img_banner: DataTypes.STRING,
		desc_banner: DataTypes.STRING,
		link_banner: DataTypes.STRING,
		created_at: DataTypes.STRING,
		updated_at: DataTypes.STRING
	}, {
		timestamps: false,
		freezeTableName: true,
		sequelize,
		modelName: 'p_banner',
	});

	p_banner.sync({ alter: false })

	p_banner.removeAttribute("id");

	return p_banner;
};