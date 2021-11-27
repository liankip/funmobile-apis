const models = require("../models");
const Op = require("sequelize").Op;

module.exports = {

	reportTransaction: async (req, res, next) => {
		try {
			let limit = (+req.query.size);
			let offset = 0;
			var condition = {
				kode: {
					[Op.like]: '%' + req.query.kode + '%'
				},
				tgl_entri : {[Op.between] : [req.query.start, req.query.end]},
				tujuan: {
					[Op.like]: '%' + req.query.number + '%'
				},
				[Op.not]: [{
					harga: 0
				}]
			}
			models.transaksi.findAndCountAll({
				where: condition
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.transaksi.findAll({
					where: condition,
					order: [
					['tgl_entri', 'desc']
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
						attributes: ["nama"]
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

	getTransaction: async (req, res, next) => {
		try {
			let id = req.params.id;
			models.transaksi.findOne({
				where: {
					kode: id
				},
				attributes: ["kode", "tgl_entri", "tujuan", "harga", "tgl_status", "status", "harga_beli", "saldo_awal", "qty", "harga_beli2", "keterangan"],
				include: [{
					model: models.reseller,
					as: "reseller",
					limit: 1,
					separate: false,
				}, {
					model: models.produk,
					as: "produk",
					limit: 1,
					separate: false,
				}],
				raw: true
			}).then((response) => {
				res.send(response);
			})
		} catch (e) { }
	},

	removeTransaction: async (req, res, next) => {
		models.transaksi.destroy({
			where: {
				kode: req.params.id,
			}
		})
	},

	reportDeposit: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			models.tiket_deposit.findAndCountAll().then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.tiket_deposit.findAll({
					where: {
						id_transaksi: {
							[Op.ne]: null
						}
					},
					order: [
					['waktu', 'desc']
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

	getDeposit: (req, res, next) => {
		try {
			let id = req.params.id;
			models.tiket_deposit.findOne({
				where: {
					kode: id,
				},
				attributes: ["kode", "waktu", "jumlah", "status", "tgl_status", "kode_pembayaran"],
				include: ["bank",
				{
					model: models.inbox,
					as: "inbox",
					limit: 1,
					separate: false,
				}, {
					model: models.reseller,
					as: "reseller",
					limit: 1,
					separate: false,
				}, {
					model: models.transaksi,
					as: "transaksi",
					limit: 1,
					separate: false,
				}]
			}).then((data) => {
				res.send(data);
			})
		} catch (e) {}
	},

	removeDeposit: async (req, res, next) => {
		try {
			models.tiket_deposit.destroy({
				where: {
					kode: req.params.id,
				}``
			})
		} catch (e) {}
	},

	reportMutation: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			models.mutasi.findAndCountAll().then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.mutasi.findAll({
					order: [
					['tanggal', 'desc'],
					],
					raw: true,
					where: {
						'$reseller.nama$': {
							[Op.like]: '%' + req.query.nama + '%'
						},
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

	getMutation: async (req, res, next) => {
		try {
			let id = req.params.id;
			models.mutasi.findOne({
				where: {
					kode: id,
				},
				order: [
				['tanggal', 'desc']
				],
				raw: true,
				include: [{
					model: models.reseller,
					as: "reseller",
					limit: 1,
					separate: false,
					attributes: ["kode", "nama", "alamat", "saldo"],
				}, {
					model: models.transaksi,
					as: "transaksi",
					limit: 1,
					separate: false,
					include: [{
						model: models.produk,
						as: "produk",
						limit: 1,
						separate: false,
					}],
				},
				"outbox"]
			}).then((data) => {
				res.send(data);
			})
		} catch (e) {}
	},

	removeMutation: async (req, res, next) => {
		try {
			models.mutasi.destroy({
				where: {
					kode: req.params.id,
				}
			})
		} catch (e) {}
	},

	reportCommission: async (req, res, next) => {
		try {
			let limit = 10;
			let offset = 0;
			models.komisi.findAndCountAll().then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.komisi.findAll({
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

	mutationWinpay: async (req, res, next) => {
		try {
			models.tiket_deposit.findAll({
				order: [
				['waktu', 'desc']
				],
				where: {
					'$tiket_response.kode_tiketdeposit$': {
						[Op.ne]: null
					},
				},
				attributes: ["kode", "waktu", "jumlah", "status", "tgl_status", "kode_pembayaran"],
				include: {
					model: models.tiket_response,
					as: 'tiket_response',
					attributes:['kode', 'kode_tiketdeposit']
				},
				raw: true
			}).then((response) => {
				res.status(200).send(response)
			})
		} catch (e) {}
	},

	getMutationwinpay: async (req, res, next) => {
		let id = req.params.id;
		try {
			models.tiket_deposit.findOne({
				where: {
					'kode': id
				},
				include: 'tiket_response',
				raw: true
			}).then((response) => {
				res.status(200).send(response)
			})
		} catch (e) {}
	}
}