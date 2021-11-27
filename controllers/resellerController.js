const models = require("../models");
const _ = require("lodash");
const {
	Op
} = require('sequelize')

const {} = require('../helper/getSignature')
const moment = require('moment-timezone')
const Sequelize = require('sequelize');

class resellerController {
	static async downline(req, res, next) {
		try {
			let subdownline = []
			let result = await models.reseller.findAll({
				where: {
					kode_upline: req.params.kode_upline
				},
				include: "pengirim",
			})
			let resultJson = JSON.stringify(result)
			let _result = JSON.parse(resultJson)
			_result.forEach(element => {
				element.jumlahDownline = 0
			})
			for (let i = 0; i < _result.length; i++) {
				let data = await models.reseller.findAll({
					where: {
						kode_upline: _result[i].kode
					}
				})
				let sdl = {
					kode_reseller: _result[i].kode,
					jd: data.length
				}
				subdownline.push(sdl)
			}
			for (let i = 0; i < _result.length; i++) {
				for (let j = 0; j < subdownline.length; j++) {
					if (_result[i].kode == subdownline[j].kode_reseller) {
						_result[i].jumlahDownline = subdownline[j].jd
					}
				}
			}
			res.status(200).json(_result)

		} catch (e) {}
	}

	static async editMarkup(req, res, next) {
		try {
			const {
				kode_reseller,
				markup
			} = req.body
			let result = await models.reseller.update({
				markup
			}, {
				where: {
					kode: kode_reseller
				}
			})
			if (result[0] == 1) {
				res.status(200).json({
					rc: '00',
					pesan: 'update markup berhasil'
				})
			} else {
				res.status(200).json({
					rc: '01',
					pesan: 'update markup gagal'
				})
			}
		} catch (error) {}
	}

	static async reward(req, res, next) {
		let result = await models.hadiah_poin.findAll({
			order: [
				['jml_poin', 'asc']
			],
			include: "hadiah_desc",
		})
		res.send(result)
	}

	static async komisi(req, res, next) {
		try {
			let user = req.logedInUser
			let result = await models.komisi.findAll({
				where: {
					kode_reseller: user.kode_reseller
				},
				order: [
					['kode_transaksi', 'desc']
				],
				include: [{
					model: transaksi,
					as: "transaksi",
					include: [{
						model: produk,
						as: 'produk'
					}],
				}]
			})
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	static async listReseller(req, res, next) {
		try {
			await models.reseller.findAll({
				order: [["tgl_daftar", "DESC"]],
				attributes: ['kode', 'nama', 'saldo', 'markup', 'aktif', 'kode_upline', 'oid', 'markup', 'poin', 'kode_level', 'alamat', 'tgl_daftar', 'suspend'],
				include: [
					{ model: models.reseller_toko, as: "toko", attributes: ['nama_toko', 'tipe_toko'] },
					{ model: models.reseller_data, as: "data", attributes: ['device_multi'] },
					{ model: models.pengirim, as: "pengirim", where: { tipe_pengirim: "S" } }
				],
				raw: true,
				//limit: 10
			}).then(function (results) {
				res.status(200).send(results)
			});
		} catch (e) {}
	}

	static async saveReseller(req, res, next) {

	}

	static async updateReseller(req, res, next) {
		await models.reseller.update({
			nama: req.body.nama,
			saldo: req.body.saldo,
			markup: req.body.markup,
			poin: req.body.poin,
			nomor_ktp: req.body.nomor_ktp,
			npwp: req.body.npwp,
			aktif: req.body.aktif,
			oid: req.body.oid,
			suspend: req.body.suspend
		}, {
			where: {
				kode: req.params.id
			},
			returning: true,
			plain: true
		}).then(function (result) {
			res.send(result);
		});
	}

	static async listResellerc(req, res, next) {
		try {
			await models.reseller.findAll({
				attributes: ["kode", "nama"]
			}).then((result) => {
				res.send(result)
			})
		} catch (e) {}
	}

	static async resellerActive(req, res, next) {
		let id = req.params.id;
		let {
			oid,
			aktif
		} = req.body
		if (oid) {
			await models.reseller.update({
				oid: req.body.oid
			}, {
				where: {
					kode: id
				},
				returning: true,
				plain: true
			}).then(function (result) {
				res.send(result);
			});
		} else {
			await models.reseller.update({
				aktif: req.body.aktif
			}, {
				where: {
					kode: id
				},
				returning: true,
				plain: true
			}).then(function (result) {
				res.send(result);
			});
		}
	}

	static async resellerAction(req, res, next) {
		let id = req.params.id;
		let {
			device_act,
			device_multi
		} = req.body
		if (device_act) {
			await models.reseller_data.update({
				device_act: device_act
			}, {
				where: {
					data_id: id
				},
				returning: true,
				plain: true
			}).then(function (result) {
				res.send(result);
			});
		} else {
			await models.reseller_data.update({
				device_multi: device_multi
			}, {
				where: {
					data_id: id
				},
				returning: true,
				plain: true
			}).then(function (result) {
				res.send(result);
			});
		}
	}

	static async resellerRemove(req, res, next) {
		let id = req.params.id;
		await models.reseller.destroy({
			where: {
				kode: id
			}
		}).then(function (deletedRecord) {
			if (deletedRecord === 1)
			res.status(200).json({
				message: "Customer " + id + " berhasil di hapus"
			});
			else
			res.status(404).json({
				message: "record not found"
			})
		})
		.catch(function (error) {});
	}

	static async resellerByCode(req, res, next) {
		let id = req.params.id;
		await models.reseller.findAll({
			where: {
				kode: id
			},
			raw: true,
			include: [
				{ model: models.pengirim, as: "pengirim" },
				{ model: models.komisi, as: 'komisi' },
				{ model: models.reseller_data, as: 'data', order: [['createdAt', 'updatedAt', 'DESC']] },
				{ model: models.reseller_toko, as: 'toko', attributes: ['nama_toko', 'alamat_toko', 'tipe_toko']
			}]
		}).then(function (result) {
			res.send(result[0]);
		});
	}

	static async resellerByData(req, res, next) {
		let id = req.params.id;
		await models.reseller_data.findAll({
			where: {
				kode_reseller: id
			},
		}).then(function (result) {
			res.send(result);
		});
	}

	static async removeDevice(req, res, next) {
		try {
			let id = req.params.id;
			await models.reseller_data.destroy({
				where: {
					data_id: id
				}
			}).then(function (deletedRecord) {
				if (deletedRecord === 1)
				res.status(200).json({
					message: "Device " + id + " berhasil di hapus"
				});
				else
				res.status(404).json({
					message: "record not found"
				})
			})
			.catch(function (error) {});
		}catch (e) {}
	}
}

module.exports = resellerController
