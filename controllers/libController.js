const models = require("../models");
const {
	Op
} = require('sequelize')
const redis = require("redis")
const moment = require("moment-timezone");
const newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");

module.exports = {
	createInfo: async (req, res, next) => {
		try {
			let {name_info, img_info, desc_info, content_info} = req.body
			let result = await models.p_info.create({
				name_info: name_info,
				img_info: img_info,
				desc_info: desc_info,
				content_info: content_info,
				created_at: newDate,
				updated_at: newDate
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	listInfo: async (req, res, next) => {
		try {
			let result = await models.p_info.findAll({})
			res.status(200).send(result);
		} catch (e) {}
	},

	getInfo: async (req, res, next) => {
		try {
			let result = await models.p_info.findOne({
				where: {
					code_info: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	putInfo: async (req, res, next) => {
		try {
			let {name_info, img_info, desc_info, content_info} = req.body
			let result = await models.p_info.update({
				name_info: name_info,
				img_info: img_info,
				desc_info: desc_info,
				content_info: content_info,
				updated_at: newDate
			}, {
				where: {
					code_info: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	deleteInfo: async (req, res, next) => {
		try {
			let result = await models.p_info.destroy({
				where: {
					code_info: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	createBanner: async (req, res, next) => {
		try {
			let {name_banner, img_banner, desc_banner, link_banner} = req.body
			let result = await models.p_banner.create({
				name_banner: name_banner,
				img_banner: img_banner,
				desc_banner: desc_banner,
				link_banner: link_banner,
				created_at: newDate,
				updated_at: newDate
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	listBanner: async (req, res, next) => {
		try {
			let result = await models.p_banner.findAll({})
			res.status(200).send(result);
		} catch (e) {}
	},

	getBanner: async (req, res, next) => {
		try {
			let result = await models.p_banner.findOne({
				where: {
					code_banner: req.params.id
				},
			})

			res.status(200).send(result);
		} catch (e) {}
	},

	putBanner: async (req, res, next) => {
		try {
			let {name_banner, img_banner, desc_banner, link_banner} = req.body
			let result = await models.p_banner.update({
				name_banner: name_banner,
				img_banner: img_banner,
				desc_banner: desc_banner,
				link_banner: link_banner,
				updated_at: newDate
			}, {
				where: {
					code_banner: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	deleteBanner: async (req, res, next) => {
		try {
			let result = await models.p_banner.destroy({
				where: {
					code_banner: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	createFlash: async (req, res, next) => {
		try {
			let {title_flash, desc_flash, img_flash, link_flash, start_flash, end_flash, type_flash, status_flash} = req.body
			let result = await models.p_flash.create({
				title_flash: title_flash,
				desc_flash: desc_flash,
				img_flash: img_flash,
				link_flash: link_flash,
				start_flash: start_flash,
				end_flash: end_flash,
				type_flash: type_flash,
				status_flash: status_flash
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	listFlash: async (req, res, next) => {
		try {
			let result = await models.p_flash.findAll({})
			res.status(200).send(result);
		} catch (e) {}
	},

	getFlash: async (req, res, next) => {
		try {
			let result = await models.p_flash.findAll({
				where: {
					code_flash: req.params.id
				}
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	putFlash: async (req, res, next) => {
		try {
			let {title_flash, desc_flash, img_flash, link_flash, start_flash, end_flash, type_flash, status_flash} = req.body
			let result = await models.p_flash.update({
				title_flash: title_flash,
				desc_flash: desc_flash,
				img_flash: img_flash,
				link_flash: link_flash,
				start_flash: start_flash,
				end_flash: end_flash,
				type_flash: type_flash,
				status_flash: status_flash
			}, {
				where: {
					code_flash: req.params.id
				}
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	deleteFlash: async (req, res, next) => {
		try {
			let result = await models.p_flash.destroy({
				where: {
					code_flash: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	createService: async (req, res, next) => {
		try {
			let {title_support, url_support, contact_support, link_support} = req.body
			let result = await models.p_support.create({
				title_support: title_support,
				url_support: url_support,
				contact_support: contact_support,
				link_support: link_support,
				createdAt: newDate,
				updatedAt: newDate
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	listService: async (req, res, next) => {
		try {
			let result = await models.p_support.findAll({})
			res.status(200).send(result);
		} catch (e) {}
	},

	getService: async (req, res, next) => {
		try {
			let result = await models.p_support.findOne({
				where: {
					code_support: req.params.id
				}
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	putService: async (req, res, next) => {
		try {
			let {title_support, url_support, contact_support, link_support} = req.body
			let result = await models.p_support.update({
				title_support: title_support,
				url_support: url_support,
				contact_support: contact_support,
				link_support: link_support,
				updatedAt: newDate
			}, {
				where: {
					code_support: req.params.id
				}
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	deleteService: async (req, res, next) => {
		try {
			let result = await models.p_support.destroy({
				where: {
					code_support: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	createReward: async (req, res, next) => {
		try {
			let {kode, jml_poin, nama, h_desc, h_img, h_stock} = req.body
			let result = await models.hadiah_poin.create({
				kode: kode,
				jml_poin: jml_poin,
				nama: nama
			})

			models.hadiah_desc.create({
				kode: kode,
				h_desc: h_desc,
				h_img: h_img,
				h_stock: h_stock
			})
			res.status(200).send(result);
		} catch (e) {}
	},

	listReward: async (req, res, next) => {
		try {
			let result = await models.hadiah_poin.findAll({
				include: { model: models.hadiah_desc },
				raw: true
			})
			res.status(200).send(result);
		} catch (error) {}
	},

	getReward: async (req, res, next) => {
		try {
			let result = await models.hadiah_poin.findOne({
				where: {
					kode: req.params.id
				},
				include: { model: models.hadiah_desc },
				raw: true
			})

			res.status(200).send(result);
		} catch (e) {}
	},

	putReward: async (req, res, next) => {
		try {
			let kode = req.params.id
			let {jml_poin, nama, h_desc, h_img, h_stock} = req.body
			let result = await models.hadiah_poin.update({
				jml_poin: jml_poin,
				nama: nama,
				updatedAt: newDate
			}, {
				where: {
					kode: kode
				}
			})

			models.hadiah_desc.update({
				h_desc: h_desc,
				h_img: h_img,
				h_stock: h_stock
			}, {
				where: {
					kode: kode
				}
			})

			res.status(200).send(result);
		} catch (e) {}
	},

	deleteReward: async (req, res, next) => {
		try {
			let result = await models.hadiah_poin.destroy({
				where: {
					kode: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	}
};