const models = require("../models");
const Op = require("sequelize").Op;

const Sequelize = require('sequelize');
const moment = require("moment-timezone");
const sDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD 00:00:00.000");
const eDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD 23:59:59.999");

module.exports = {
	countTrx: async (req, res, next) => {
		try {
			var Success = await models.transaksi.count({
				where: {
					status: 20
				}
			}).then((data) => {
				return data
			})
			var Pending = await models.transaksi.count({
				where: {
					status: 2,
				}
			}).then((data) => {
				return data
			})
			var Failed = await models.transaksi.count({
				where: {
					status: 40
				}
			}).then((data) => {
				return data
			})
			res.send({
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

	countALl: async (req, res, next) => {
		try {
			var Income = await models.transaksi.findAll({
				where: {
					status: 20
				},
				attributes: [
					[Sequelize.fn('sum', Sequelize.col('harga')), 'total'],
				],
			}).then((data) => {
				return JSON.stringify(data[0])
			})
			var Customer = await models.reseller.count().then((data) => {
				return data
			})
			var Produk = await models.produk.count().then((data) => {
				return data
			})
			var Transaksi = await models.transaksi.count().then((data) => {
				return data
			})
			var Deposit = await models.tiket_deposit.findAll({
				where: {
					status: 'S'
				},
				attributes: [
					[Sequelize.fn('sum', Sequelize.col('jumlah')), 'total'],
				],
			}).then((data) => {
				return JSON.stringify(data[0])
			})
			var Reseller = await models.reseller.findAll({
				attributes: [
					[Sequelize.fn('sum', Sequelize.col('saldo')), 'total'],
				],
			}).then((data) => {
				return JSON.stringify(data[0])
			})

			let deposit = JSON.parse(Deposit)
			let reseller = JSON.parse(Reseller)
			let my = JSON.parse(Income)

			res.send({
				income: {
					"nama": "Total Omset",
					"total": my.total,
					"color": "fill-current text-green-600",
					"icon": "M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"
				},
				customer: {
					"nama": "Total Customer",
					"total": Customer,
					"color": "fill-current text-blue-600",
					"icon": "M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z"
				},
				produk: {
					"nama": "Total Produk",
					"total": Produk,
					"color": "fill-current text-red-600",
					"icon": "M5.12,5H18.87L17.93,4H5.93L5.12,5M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M6,18H12V15H6V18Z"
				},
				transaksi: {
					"nama": "Total Transaksi",
					"total": Transaksi,
					"color": "fill-current text-gray-600",
					"icon": "M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z"
				},
				Deposit: {
					"nama": "Total Deposit",
					"total": deposit.total,
					"color": "fill-current text-indigo-600",
					"icon": "M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z"
				},
				Reseller: {
					"nama": "Total Saldo Customer",
					"total": reseller.total,
					"color": "fill-current text-green-600",
					"icon": "M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z"
				}
			})
		} catch (e) {}
	},

	countTrxd: async (req, res, next) => {
		try {
			var Success = await models.transaksi.count({
				where: {
					status: 20,
					tgl_entri: {
						[Op.between]: [sDate, eDate]
					},
				}
			}).then((data) => {
				return data
			})
			var Pending = await models.transaksi.count({
				where: {
					status: 2,
					tgl_entri: {
						[Op.between]: [sDate, eDate]
					},
				}
			}).then((data) => {
				return data
			})
			var Failed = await models.transaksi.count({
				where: {
					status: 40,
					tgl_entri: {
						[Op.between]: [sDate, eDate]
					},
				}
			}).then((data) => {
				return data
			})
			res.send({
				succes: {
					"nama": "Transaksi Berhasil Hari ini",
					"total": Success,
					"color": "fill-current text-green-600",
					"icon": "M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z"
				},
				pending: {
					"nama": "Transaksi Pending Hari ini",
					"total": Pending,
					"color": "fill-current text-yellow-600",
					"icon": "M21.8 15C22.4 15 23 15.6 23 16.3V19.8C23 20.4 22.4 21 21.7 21H16.2C15.6 21 15 20.4 15 19.7V16.2C15 15.6 15.6 15 16.2 15V13.5C16.2 12.1 17.6 11 19 11C20.4 11 21.8 12.1 21.8 13.5V15M20.5 15V13.5C20.5 12.7 19.8 12.2 19 12.2C18.2 12.2 17.5 12.7 17.5 13.5V15H20.5M2 6H20V9.1L19 9C18.18 9 17.41 9.2 16.73 9.54C16.28 9.18 16 8.62 16 8H6C6 9.11 5.11 10 4 10V14C5.11 14 6 14.9 6 16H13.04L13 16.5V18H2V6M11 9C12.66 9 14 10.34 14 12C14 13.66 12.66 15 11 15C9.34 15 8 13.66 8 12C8 10.34 9.34 9 11 9Z"
				},
				failed: {
					"nama": "Transaksi Gagal Hari ini",
					"total": Failed,
					"color": "fill-current text-red-600",
					"icon": "M15.46 18.12L16.88 19.54L19 17.41L21.12 19.54L22.54 18.12L20.41 16L22.54 13.88L21.12 12.46L19 14.59L16.88 12.46L15.46 13.88L17.59 16M14.97 11.62C14.86 10.28 13.58 8.97 12 9C10.3 9.04 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.39 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.62M13 16H7C7 14.9 6.1 14 5 14V10C6.1 10 7 9.1 7 8H17C17 9.1 17.9 10 19 10V10.05C19.67 10.06 20.34 10.18 21 10.4V6H3V18H13.32C13.1 17.33 13 16.66 13 16Z"
				},
			})
		} catch(e) {}
	},

	chartTrx: async (req, res, next) => {
		try {
			await models.transaksi.findAll({
				attributes: [
					[Sequelize.fn("month", Sequelize.col("tgl_entri")), 'x'],
					[Sequelize.fn('SUM', Sequelize.col('harga')), 'y'],
				],
				group: [Sequelize.fn("month", Sequelize.col("tgl_entri"))],
				where: {
					status: 20,
				},
				order: [
					[Sequelize.fn("month", Sequelize.col("tgl_entri")), 'ASC']
				]
			}).then((data) => {
				res.send(data)
			})
		} catch (e) {}
	},

	inboxList: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			let criteria = {
				pengirim: {
					[Op.or]: [
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('pengirim')), 'LIKE', '08%'),
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('pengirim')), 'LIKE', '+62%'),
					],
				},
			}
			models.inbox.findAndCountAll({where: criteria}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.inbox.findAll({
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					where: criteria,
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

	outboxList: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			let criteria = {
				penerima: {
					[Op.or]: [
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('penerima')), 'LIKE', '08%'),
						Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('penerima')), 'LIKE', '+62%'),
					],
				},
			}

			models.outbox.findAndCountAll({where: criteria}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.outbox.findAll({
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					where: criteria,
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

	profit: async(req, res, next) => {
		try {
			models.transaksi.findAll({
				attributes: [
					[Sequelize.fn('DAY', Sequelize.col('tgl_entri')), 'tanggal'],
					[Sequelize.fn('SUM', Sequelize.col('harga')), 'penjualan'],
					[Sequelize.fn('SUM', Sequelize.col('harga_beli')), 'pembelian'],
					[Sequelize.fn('SUM', Sequelize.col('komisi')), 'komisi'],
					[Sequelize.literal('SUM(harga - harga_beli - komisi)'), 'laba']
				],
				where: {
				    "status": 20,
					"tgl_entri" : {[Op.between] : [req.params.start, req.params.end]}
				},
				order: [[Sequelize.fn('DAY', Sequelize.col('tgl_entri')), 'ASC']],
				group: [Sequelize.fn('DAY', Sequelize.col('tgl_entri'))]
			}).then((response) => {
				res.status(200).send({
					'result': response
				})
			})
		} catch (e) {}
	},

	trxS: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			let criteria = {
				status: req.query.status,
				tgl_entri: {
					[Op.between]: [sDate, eDate]
				}
			};
			models.transaksi.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.transaksi.findAll({
					where: criteria,
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "tujuan", "harga", "status"],
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

	trxP: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			let criteria = {
				status: '2',
				tgl_entri: {
					[Op.between]: [sDate, eDate]
				}
			}
			models.transaksi.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.transaksi.findAll({
					where: criteria,
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "tujuan", "harga", "status"],
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

	trxF: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			let criteria = {
				tgl_entri: {
					[Op.between]: [sDate, eDate]
				},
				status: {
					[Op.gt]: 40
				}
			}
			models.transaksi.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.transaksi.findAll({
					where: criteria,
					order: [
						['tgl_entri', 'desc'],
						['kode', 'desc']
					],
					attributes: ["kode", "tujuan", "harga", "status"],
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
	}
}
