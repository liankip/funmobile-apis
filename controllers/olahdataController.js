const models = require("../models");
const {
	Op
} = require('sequelize')
const {
	getReseller,
	getProdukPerOperator,
	getProdukUpline,
	getKodeOperator,
	getOperatorUpline,
} = require('../helper/getData')

const {
	levelA,
	levelD,
	levelMS,
	levelR,
	hargaMarkUp,
	hargaMarkUpOperator
} = require('../helper/hargaPerLevel')

const moment = require("moment-timezone");
const newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");

const Sequelize = require('sequelize');

class olahdata {
	static fixProduk(kode_reseller, kode_operator, kriteria, jmlMarkup, produkMarkup) {
		return new Promise(async function (resolve, reject) {
			try {
				let produk
				let user
				let produk_upline
				user = await getReseller(kode_reseller)
				produk = await getProdukPerOperator(kode_operator, kriteria) // produk yang mau ditampilkan
				if (user.kode_level == 'O' || user.kode_level == 'H') {
					let produkFix = await hargaMarkUp(produk, produkMarkup, jmlMarkup)
					resolve(produkFix)
				} else if (user.kode_level == 'M' || user.kode_level == 'S') {
					let response = await levelMS(produk)
					let produkFix = await hargaMarkUp(response, produkMarkup, jmlMarkup)
					resolve(produkFix)
				}
			} catch (error) {
				reject(error)
			}
		})
	}

	static fixOperator(kode_reseller, kode_operator, kriteria, jmlMarkup, produkMarkup) {
		return new Promise(async function (resolve, reject) {
			try {
				let produk;
				let user;
				let produk_upline;
				user = await getReseller(kode_reseller);
				produk = await getProdukPerOperator(kode_operator, kriteria); // produk yang mau ditampilkan
				if (user.kode_level == "O" || user.kode_level == "H") {
					let produkFix = await hargaMarkUpOperator(produk, produkMarkup, jmlMarkup);
					resolve(produkFix);
				} else if (user.kode_level == "M" || user.kode_level == "S") {
					let response = await levelMS(produk);
					let produkFix = await hargaMarkUpOperator(response, produkMarkup, jmlMarkup);
					resolve(produkFix);
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	static async pulsaPerReseller(req, res, next) {
		let prefix_tujuan = req.body.prefix_tujuan
		let kode_reseller = req.logedInUser.kode_reseller
		let byu, hsm, htp, ip, tm, xp, xpp

		async function totalMarkup(itself, kode_reseller, kodeOperator, kriteria, markup, produk) {
			let reseller = await getReseller(kode_reseller)
			let jmlMarkup = markup
			let produkYangDimarkup = produk
			if (reseller.kode == itself) {} else {
				let result = await getProdukUpline(reseller.kode)
				for (let i = 0; i < result.length; i++) {
					let newData = {
						kode_reseller: result[i].kode_reseller,
						kode_produk: result[i].kode_produk,
						markup: result[i].markup
					}
					produkYangDimarkup.push(newData)
				}
			}

			if (reseller.markup != 0) {
				jmlMarkup += reseller.markup
				totalMarkup(itself, reseller.kode_upline, kodeOperator, kriteria, jmlMarkup, produkYangDimarkup)
			} else {
				let dataProduk = await olahdata.fixProduk(itself, kodeOperator, kriteria, jmlMarkup, produkYangDimarkup)
				dataProduk.push({
					gambar: 'http://amcmedan.com/wp-content/uploads/2020/03/Telkomsel-icon.png'
				})
				res.status(200).json(dataProduk)
			}
		}

		if (prefix_tujuan.slice(0, 4) == '0851') {
			if (prefix_tujuan.length >= 6) {
				if (prefix_tujuan.slice(0, 6) == '085154' || prefix_tujuan.slice(0, 6) == '085155' || prefix_tujuan.slice(0, 6) == '085156' || prefix_tujuan.slice(0, 6) == '085157') {
					byu = true
				} else {
					tm = true
				}
			} else {
				tm = true
			}
		} else {
			hsm = ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(prefix_tujuan.slice(0, 4))
			htp = ['0895', '0896', '0897', '0898', '0899'].includes(prefix_tujuan.slice(0, 4)) // uan thhree
			ip = ['0815', '0816', '0855', '0856', '0857', '0858', '0814'].includes(prefix_tujuan.slice(0, 4)) // i indosat
			tm = ['0812', '0813', '0821', '0822', '0823', '0852', '0853', '0851'].includes(prefix_tujuan.slice(0, 4)) // // telkomsel
			xp = ['0878', '0877', '0817', '0818', '0819', '0859'].includes(prefix_tujuan.slice(0, 4))
			xpp = ['0838', '0831', '0832', '0833'].includes(prefix_tujuan.slice(0, 4))
		}

		if (byu) {
			totalMarkup(kode_reseller, kode_reseller, 'BYU', null, 0, [])
		} else if (hsm) {
			totalMarkup(kode_reseller, kode_reseller, 'HSM', null, 0, [])
		} else if (htp) {
			totalMarkup(kode_reseller, kode_reseller, 'HTP', null, 0, [])
		} else if (ip) {
			totalMarkup(kode_reseller, kode_reseller, 'IP', null, 0, [])
		} else if (tm) {
			totalMarkup(kode_reseller, kode_reseller, 'TM', null, 0, [])
		} else if (xp || xpp) {
			totalMarkup(kode_reseller, kode_reseller, 'XP', null, 0, [])
		} else {
			res.status(400).json({
				pesan: 'Operator Tidak Ditemukan'
			})
		}
	}

	static async getProduk(req, res, next) {
		try {
			let kodeOperator = req.query.kodeOperator
			let kode_reseller = req.logedInUser.kode_reseller
			let kriteria = req.query.kriteria
			async function totalMarkup(itself, kode_reseller, kodeOperator, kriteria, markup, produk) {
				let reseller = await getReseller(kode_reseller)
				let jmlMarkup = markup
				let produkYangDimarkup = produk
				if (reseller.kode == itself) {} else {
					let result = await getProdukUpline(reseller.kode)
					for (let i = 0; i < result.length; i++) {
						let newData = {
							kode_reseller: result[i].kode_reseller,
							kode_produk: result[i].kode_produk,
							markup: result[i].markup
						}
						produkYangDimarkup.push(newData)
					}
				}
				if (reseller.markup != 0) {
					jmlMarkup += reseller.markup
					totalMarkup(itself, reseller.kode_upline, kodeOperator, kriteria, jmlMarkup, produkYangDimarkup)
				} else {
					let result = await olahdata.fixProduk(itself, kodeOperator, kriteria, jmlMarkup, produkYangDimarkup)
					res.status(200).json(result)
				}
			}
			totalMarkup(kode_reseller, kode_reseller, kodeOperator, kriteria, 0, [])
		} catch (e) {}
	}

	static async banner(req, res, next) {
		try {
			let result = await models.p_banner.findAll()
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	static async info(req, res, next) {
		try {
			let result = await models.p_info.findAll()
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	static async getProductbyProvider(req, res, next) {
		try {
			let kodeOperator = req.query.kodeOperator;
			let kode_reseller = req.logedInUser.kode_reseller;
			let kriteria = req.query.kriteria;

			async function totalMarkup(itself, kode_reseller, kodeOperator, kriteria, markup, produk) {
				let reseller = await getReseller(kode_reseller);
				let jmlMarkup = markup;
				let produkYangDimarkup = produk;
				let result = await getOperatorUpline(reseller.kode, kodeOperator);
				for (let i = 0; i < result.length; i++) {
					let newData = {
						kode_reseller: result[i].kode_reseller,
						kode_operator: result[i].kode_operator,
						markup: result[i].markup,
					};
					produkYangDimarkup.push(newData);
				}

				if (reseller.markup != 0) {
					jmlMarkup += reseller.markup;
					totalMarkup(itself, reseller.kode_upline, kodeOperator, kriteria, jmlMarkup, produkYangDimarkup);
				} else {
					let result = await olahdata.fixOperator(itself, kodeOperator, kriteria, jmlMarkup, produkYangDimarkup);
					res.status(200).json(result);
				}
			}
			totalMarkup(kode_reseller, kode_reseller, kodeOperator, kriteria, 0, []);
		} catch (e) {}
	}

	static async listMarkuoperator(req, res, next) {
		try {
			let kode_reseller = req.logedInUser.kode_reseller;
			let limit = 10;
			let offset = 0;
			let criteria = {
				nama: {
					[Op.like]: '%' + req.query.nama + '%'
				},
			}
			models.operator.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.operator.findAll({
					where: criteria,
					include: [{
						model: models.markup_operator,
						as: "markup_operator",
						include: [{
							model: models.reseller,
							as: "reseller",
							attributes: ["kode", "nama"],
							where: {
								kode: {
									[Op.like]: '%'+kode_reseller+'%'
								}
							}
						}]
					}],
					attributes: ["kode", "nama", "prefix_tujuan", "tgl_data"],
					raw: true,
					order: [
						['nama', 'ASC']
					],
					limit: limit,
					offset: offset,
				})
				.then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (e) {}
	}

	static async addEditMarkupoperator(req, res, next) {
		try {
			let codeReseller = req.logedInUser.kode_reseller;
			let {
				kode_operator,
				markup
			} = req.body

			const result = await models.markup_operator.count({
				where: {
					kode_reseller : codeReseller,
					kode_operator : kode_operator
				}
			})

			if (result > 0) {
				await models.markup_operator.update({
					markup: markup,
					tgl_data: newDate
				}, {
					where: {
						kode_reseller: codeReseller,
						kode_operator: kode_operator
					},
					returning: true,
					plain: true
				}).then((response) => {
					res.send(response[1])
				})
			} else {
				await models.markup_operator.create({
					kode_reseller: codeReseller,
					kode_operator: kode_operator,
					markup: markup,
					tgl_data: newDate
				}).then((response) => {
					res.send(response)
				})
			}
		} catch (err) {}
	}

	static async listMarkuproduct(req, res, next) {
		try {
			let kode_reseller = req.logedInUser.kode_reseller;
			let limit = 10;
			let offset = 0;
			let criteria = {
				nama: {
					[Op.like]: '%' + req.query.nama + '%'
				},
			}

			models.produk.findAndCountAll({
				where: criteria
			}).then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.produk.findAll({
					limit: limit,
					offset: offset,
					raw: true,
					where: criteria,
					attributes: ["kode", "nama"],
					include: [{
						model: models.markup_produk,
						as: "markup_produk",
						include: [{
							model: models.reseller,
							as: "reseller",
							attributes: ["kode", "nama"],
							where: {
								kode: {
									[Op.like]: '%'+kode_reseller+'%'
								}
							}
						}]
					}, {
						model: models.operator,
						as: "operator",
						attributes: ["kode", "nama"]
					}]
				})
				.then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				})
			})
		} catch (err) {}
	}

	static async addEditMarkupproduct(req, res, next) {
		try {
			let codeReseller = req.logedInUser.kode_reseller;
			let {
				kode_produk,
				markup
			} = req.body

			const result = await models.markup_produk.count({
				where: {
					kode_reseller : codeReseller,
					kode_produk : kode_produk
				}
			})

			if (result > 0) {
				await models.markup_produk.update({
					markup: markup,
					tgl_data: newDate
				}, {
					where: {
						kode_reseller: codeReseller,
						kode_produk: kode_produk
					},
					returning: true,
					plain: true
				}).then((response) => {
					res.send(response[1])
				})
			} else {
				await models.markup_produk.create({
					kode_reseller: codeReseller,
					kode_produk: kode_produk,
					markup: markup,
					tgl_data: newDate
				}).then((response) => {
					res.send(response)
				})
			}
		} catch (err) {
			res.send(err.message)
		}
	}

	static async allProduct(req, res, next) {
		try {
			let limit = (+req.query.size);
			let offset = 0;
			models.produk.findAndCountAll().then((data) => {
				let page = req.query.page;
				let pages = Math.ceil(data.count / limit);
				offset = limit * (page - 1);

				models.produk.findAll({
					where: {
						nama: {
							[Op.like]: '%' + req.query.name + '%'
						}
					},
					order: [
						['tgl_data', 'desc']
					],
					attributes: ["kode", "nama", "harga_beli", "harga_jual", "aktif", "gangguan"],
					limit: limit,
					offset: offset,
				}).then((response) => {
					res.status(200).json({
						'result': response,
						'count': data.count,
						'pages': pages
					})
				}).catch(error => {})
			});
		} catch (e) {}
	}

	static async productByCode(req, res, next) {
		try {
			let id = req.params.id;
			await models.produk.findAll({
				where: {
					kode: id
				},
				include: [{
					model: models.operator,
					as: "operator",
					attributes: ["kode", "nama"],
				}]
			}).then((response) => {
				res.send(response)
			})
		} catch (e) {}
	}

	static async updateProduct(req, res, next) {
		try {
			let {nama, harga_jual, harga_beli, aktif, gangguan, catatan} = req.body
			let result = await models.produk.update({
				nama: nama,
				harga_jual: harga_jual,
				harga_beli: harga_beli,
				aktif: aktif,
				gangguan: gangguan,
				catatan: catatan,
			}, {
				where: {
					kode: req.params.id
				},
			})
			res.status(200).send(result);
		} catch (e) {}
	}

	static async removeProduct(req, res, next) {
		try {
			const result = await models.produk.destroy({
				where: {
					kode: req.params.id
				}
			})

			if (result) {
				res.json({
					'data': result,
				})
			}
		} catch (e) {}
	}

	static async allProvider(req, res, next) {
		try {
			const result = await models.operator.findAll({
				order: [
					['tgl_data', 'desc']
				]
			})
			res.send(result)
		} catch (e) {}
	}

	static async getProvider(req, res, next) {
		try {
			const result = await models.operator.findOne({
				where: {
					kode: req.params.id
				}
			})
			res.send(result)
		} catch (e) {}
	}

	static async createProvider(req, res, next) {
		try {
			let {kode, nama, prefix_tujuan, gangguan, kosong, regex_tujuan, catatan, apk_ikon} = req.body
			let result = await models.operator.create({
				kode: kode,
				nama: nama,
				prefix_tujuan: prefix_tujuan,
				gangguan: gangguan,
				kosong: kosong,
				regex_tujuan: regex_tujuan,
				catatan: catatan,
				apk_ikon: apk_ikon
			})
			res.status(200).send(result);
		} catch (e) {
			res.send(e.message)
		}
	}

	static async updateProvider(req, res, next) {
		try {
			let {nama, prefix_tujuan, gangguan, kosong, regex_tujuan, catatan, apk_ikon} = req.body
			let result = await models.operator.update({
				nama: nama,
				prefix_tujuan: prefix_tujuan,
				gangguan: gangguan,
				kosong: kosong,
				regex_tujuan: regex_tujuan,
				catatan: catatan,
				apk_ikon: apk_ikon
			}, {
				where: {
					kode: req.params.id
				},
			})

			models.produk.update({
				catatan: apk_ikon,
			}, {
				where: {
					kode_operator: req.params.id
				},
			})

			res.status(200).send(result);
		} catch (e) {}
	}

	static async deleteProvider(req, res, next) {
		try {
			const result = await models.operator.destroy({
				where: {
					kode: req.params.id
				}
			})
			res.status(200).send((result).toString());
		} catch (e) {}
	}
}

module.exports = olahdata;