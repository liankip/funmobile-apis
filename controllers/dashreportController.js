const models = require("../models");
const Op = require("sequelize").Op;
let andOp = Op.and

const Sequelize = require('sequelize');
const moment = require("moment-timezone");
const newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");

module.exports = {
	countTrxr: async (req, res, next) => {
		let user = req.logedInUser
		try {
			var Income = await models.reseller.findAll({
				where: {
					kode: user.kode_reseller
				},
			}).then((data) => {
				return JSON.stringify(data[0])
			})
			var Success = await models.transaksi.count({
				where: {
					kode_reseller: user.kode_reseller,
					status: 20
				}
			}).then((data) => {
				return data
			})
			var Pending = await models.transaksi.count({
				where: {
					kode_reseller: user.kode_reseller,
					status: 2,
				}
			}).then((data) => {
				return data
			})
			var Failed = await models.transaksi.count({
				where: {
					kode_reseller: user.kode_reseller,
					status: 40
				}
			}).then((data) => {
				return data
			})

			let my = JSON.parse(Income)
			res.send({
				income: {
					"nama": "Saldo",
					"total": my.saldo,
					"color": "fill-current text-green-600",
					"icon": "M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"
				},

				succes: {
					"nama": "Transaksi Berhasil",
					"total": Success,
					"color": "fill-current text-green-600",
					"icon": "M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z"
				},
				pending: {
					"nama": "Transaksi Pending",
					"total": Pending,
					"color": "fill-current text-yellow-600",
					"icon": "M21.8 15C22.4 15 23 15.6 23 16.3V19.8C23 20.4 22.4 21 21.7 21H16.2C15.6 21 15 20.4 15 19.7V16.2C15 15.6 15.6 15 16.2 15V13.5C16.2 12.1 17.6 11 19 11C20.4 11 21.8 12.1 21.8 13.5V15M20.5 15V13.5C20.5 12.7 19.8 12.2 19 12.2C18.2 12.2 17.5 12.7 17.5 13.5V15H20.5M2 6H20V9.1L19 9C18.18 9 17.41 9.2 16.73 9.54C16.28 9.18 16 8.62 16 8H6C6 9.11 5.11 10 4 10V14C5.11 14 6 14.9 6 16H13.04L13 16.5V18H2V6M11 9C12.66 9 14 10.34 14 12C14 13.66 12.66 15 11 15C9.34 15 8 13.66 8 12C8 10.34 9.34 9 11 9Z"
				},
				failed: {
					"nama": "Transaksi Gagal",
					"total": Failed,
					"color": "fill-current text-red-600",
					"icon": "M15.46 18.12L16.88 19.54L19 17.41L21.12 19.54L22.54 18.12L20.41 16L22.54 13.88L21.12 12.46L19 14.59L16.88 12.46L15.46 13.88L17.59 16M14.97 11.62C14.86 10.28 13.58 8.97 12 9C10.3 9.04 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.39 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.62M13 16H7C7 14.9 6.1 14 5 14V10C6.1 10 7 9.1 7 8H17C17 9.1 17.9 10 19 10V10.05C19.67 10.06 20.34 10.18 21 10.4V6H3V18H13.32C13.1 17.33 13 16.66 13 16Z"
				},
			})
		} catch (e) {}
	},

	chartTrxr: async (req, res, next) => {
		let user = req.logedInUser
		try {
			await models.transaksi.findAll({
				attributes: [
					[Sequelize.fn("month", Sequelize.col("tgl_entri")), 'x'],
					[Sequelize.fn('SUM', Sequelize.col('harga')), 'y'],
				],
				group: [Sequelize.fn("month", Sequelize.col("tgl_entri"))],
				where: {
					kode_reseller: user.kode_reseller,
					status: 20
				},
				order: [
					[Sequelize.fn("month", Sequelize.col("tgl_entri")), 'ASC']
				]
			}).then((data) => {
				res.send(data)
			})
		} catch(e) {}
	},

	inboxListr: async (req, res, next) => {
		let user = req.logedInUser
		try {
			let limit = 50;
			let offset = 0;
			let criteria = {
				kode_reseller: user.kode_reseller,
				pengirim: {
					[Op.or]: [
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('pengirim')), 'LIKE', '08%'),
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('pengirim')), 'LIKE', '+62%'),
					],
				},
			}

			models.inbox.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.inbox.findAll({
					where: criteria,
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "tgl_entri", "penerima", "pengirim", "pesan", "status"],
					limit: limit,
					offset: offset,
				}).then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	},

	outboxListr: async (req, res, next) => {
		let user = req.logedInUser
		try {
			let limit = 50;
			let offset = 0;
			let criteria = {
				kode_reseller: user.kode_reseller,
				penerima: {
					[Op.or]: [
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('penerima')), 'LIKE', '08%'),
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('penerima')), 'LIKE', '+62%'),
					],
				},
			}

			models.outbox.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.outbox.findAll({
					where: criteria,
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "tgl_entri", "penerima", "pengirim", "pesan", "status"],
					raw: true,
					limit: limit,
					offset: offset,
				}).then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	},

	rTransaction: async (req, res, next) => {
		let user = req.logedInUser
		try {
			let limit = (+req.query.size);
			let offset = 0;
			let criteria = {
				kode_reseller: user.kode_reseller,
				[Op.not]: [{
					harga: 0
				}]
			}

			models.transaksi.findAndCountAll({where: criteria}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.transaksi.findAll({
					where: criteria,
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "tgl_entri", "tujuan", "harga", "status"],
					include: [{
						model: models.reseller,
						as: "reseller",
						limit: 1,
						separate: false,
						attributes: ["nama", "alamat"]
					}, {
						model: models.produk,
						as: "produk",
						limit: 1,
						separate: false,
						attributes: ["kode", "nama"]
					}],
					limit: limit,
					offset: offset,
					raw: true
				}).then((response) => {
					res.status(200).send({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	},

	rDeposit: async (req, res, next) => {
		let user = req.logedInUser
		try {
			let limit = 50;
			let offset = 0;
			let criteria = {
				kode_reseller: user.kode_reseller,
				id_transaksi: {
					[Op.ne]: null
				}
			};
			models.tiket_deposit.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.tiket_deposit.findAll({
					where: criteria,
					order: [
						['waktu', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "waktu", "jumlah", "status", "tgl_status", "kode_pembayaran"],
					include: ["bank", {
						model: models.reseller,
						as: "reseller",
						limit: 1,
						separate: false,
						attributes: ["kode", "nama"]
					}],
					limit: limit,
					offset: offset,
					raw: true
				}).then((response) => {
					res.status(200).send({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	},

	rMutation: async (req, res, next) => {
		let user = req.logedInUser
		try {
			let limit = 50;
			let offset = 0;

			models.mutasi.findAndCountAll({
				where: {
					kode_reseller: user.kode_reseller
				},
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.mutasi.findAll({
					order: [
						['tanggal', 'desc'],
						['kode', 'desc']
					],
					raw: true,
					where: {
						kode_reseller: user.kode_reseller
					},
					attributes: ["kode", "tanggal", "jumlah"],
					include: [{
						model: models.reseller,
						as: "reseller",
						limit: 1,
						separate: false,
						attributes: ["nama"]
					}, {
						model: models.transaksi,
						as: "transaksi",
						limit: 1,
						separate: false,
						attributes: ["status"]
					}],
					limit: limit,
					offset: offset,
				}).then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	},

	rCommission: async (req, res, next) => {
		let user = req.logedInUser
		try {
			let limit = 50;
			let offset = 0;
			models.komisi.findAndCountAll({
				where: {
					kode_reseller: user.kode_reseller
				},
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.komisi.findAll({
					where: {
						kode_reseller: user.kode_reseller
					},
					order: [
						['kode_transaksi', 'desc']
					],
					raw: true,
					include: [{
						model: models.transaksi,
						as: "transaksi",
						attributes: ["tujuan", "tgl_entri"],
						include: [{
							model: models.produk,
							as: 'produk',
							attributes: ["kode", "nama"]
						}],
					}, {
						model: models.reseller,
						as: "reseller",
						attributes: ["kode", "nama"],
					}],
					limit: limit,
					offset: offset,
				}).then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	},

	getProfile: async (req, res, next) => {
		try {
			let user = req.logedInUser
			res.send(user)
		} catch (e) {}
	}
}
