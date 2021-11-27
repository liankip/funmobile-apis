const models = require("../models");
const {
	getToken,
	verifyToken
} = require('../helper/jwt')
const {
	otpGen
} = require('../helper/otpGen')
const {} = require('../helper/getSignature')
const Op = require("sequelize").Op;
const moment = require('moment-timezone')
const newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");

module.exports = {
	authSignindashboard: async (req, res, next) => {
		try {
			let {
				username,
				password
			} = req.body

			let result = await models.reseller_role.findOne({
				where: {
					R_Username: username,
					R_Password: password
				},
			})


			let otp = otpGen()
			let data = {
				otp,
				result
			}

			let token = getToken(data)
			res.status(200).json({
				token: token
			})
		} catch (e) {
			res.send(e.message)
		}
	},

	authSigninreport: async (req, res, next) => {
		try {
			let notelp = '+62' + req.body.notelp.slice(1, 12)
			let logedInUser = {
				notelp: notelp,
				pin: req.body.pin
			}
			let result = await models.pengirim.findOne({
				where: {
					pengirim: logedInUser.notelp
				},
				include: [{
					model: models.reseller,
					as: "reseller",
				}]
			})

			if (result !== null) {
				let otp = otpGen()
				let data = {
					kode_reseller: result.reseller.kode,
					otp,
					notelp: result.pengirim,
					nama: result.reseller.nama,
				}

				let token = getToken(data)
				res.status(200).json({
					token: token
				})
			} else {
				res.status(200).json({
					error: "99"
				})
			}
		} catch (e) {
			res.send(e.message)
		}
	},

	authSendotp: async (req, res, next) => {
		let decodeToken = verifyToken(req.headers.token)
		let newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");
		let item = {
			tgl_entri: newDate,
			tgl_status: newDate,
			pengirim: null,
			penerima: decodeToken.notelp,
			tipe_penerima: 'S',
			pesan: 'FUNMOBILE :) HI ' + decodeToken.nama + ' SILAHKAN MASUKKAN KODE OTP ' + decodeToken.otp + ' UNTUK MASUK DI APLIKASI, JANGAN BERITAHU OTP INI KEPADA ORANG LAIN.',
			kode_reseller: decodeToken.kode_reseller,
			kode_inbox: null,
			kode_transaksi: null,
			status: 0,
			bebas_biaya: 1,
			prioritas: 3,
			kode_terminal: null,
			modul_proses: ','
		}
		await models.outbox.create(item)
		res.status(200).json({
			kode: '00',
			pesan: 'OTP sudah dikirim melalu SMS'
		})
	},

	authOtp: async (req, res, next) => {
		try {
			let {
				token,
				otp
			} = req.params
			let decodeToken = verifyToken(token)

			if (token && otp) {
				if (decodeToken.otp == otp) {
					let result = await models.reseller.findAll({
						where: {
							kode: decodeToken.kode_reseller,
						}
					})
					res.status(200).json(result)
				} else {
					res.status(200).json({
						"error": 01
					})
				}
			}
		} catch (error) {}
	},

	authAdd: async (req, res, next) => {
		try {
			let {
				username,
				password,
				role,
				status
			} = req.body
			let result = await models.reseller_role.create({
				R_Username: username,
				R_Password: password,
				R_Role: role,
				R_Status: status
			})
			res.status(200).json(result)
		} catch (e) {}
	},

	authManage: async (req, res, next) => {
		try {
			let result = await models.reseller_role.findAll({
				where: {
					R_Name: {
						[Op.like]: '%' + req.query.name + '%'
					}
				},
			})
			res.status(200).json(result)
		} catch (e) {}
	},

	authCreated: async (req, res, next) => {
		try {
			let {
				R_Name,
				R_Username,
				R_Password,
				R_Role,
				R_Status
			} = req.body
			let result = await models.reseller_role.create({
				R_Name: R_Name,
				R_Username: R_Username,
				R_Password: R_Password,
				R_Role: R_Role,
				R_Status: R_Status,
				createdAt: newDate,
				updatedAt: newDate
			})
			res.status(200).json(result)
		} catch (e) {}
	},

	authManageid: async (req, res, next) => {
		try {
			let result = await models.reseller_role.findAll({
				where: {
					R_ID: req.params.id
				}
			})
			res.status(200).json(result[0])
		} catch (e) {}
	},

	authUpdate: async (req, res, next) => {
		try {
			let {
				R_Name,
				R_Username,
				R_Password,
				R_Role,
				R_Status
			} = req.body
			let result = await models.reseller_role.update({
				R_Name: R_Name,
				R_Username: R_Username,
				R_Password: R_Password,
				R_Role: R_Role,
				R_Status: R_Status,
				updatedAt: newDate
			}, {
				where: {
					R_ID: req.params.id
				}
			})
			res.status(200).json(result)
		} catch (e) {}
	},

	authDelete: async (req, res, next) => {
		try {
			let result = await models.reseller_role.destroy({
				where: {
					R_ID: req.params.id
				}
			})
			res.status(200).json(result)
		} catch (e) {}
	}
}