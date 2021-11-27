const {
	inbox,
	reseller,
	pengirim,
	tiket_deposit,
	outbox,
	transaksi
} = require("../models");
const models = require("../models");
const moment = require("moment-timezone");
const newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");

class inboxController {
	static formatJson(id, number, message) {
		let str = number
		str.replace('+62', "0")

		return {
			tgl_entri: newDate,
			penerima: null,
			kode_reseller: id,
			pengirim: number,
			tipe_pengirim: "Y",
			pesan: message,
			kode_terminal: "1",
			kode_transaksi: "",
			status: "0",
			tgl_status: newDate,
			is_jawaban: "0",
			service_center: "+62816124",
		};
	}

	static async changeMarkupDownline(req, res, next) {
		try {
			let user = req.logedInUser

			let {
				kode_reseller,
				kode_operator,
				markup
			} = req.body

			let product = await models.produk.findAll({
				where: {
					kode_operator: kode_operator
				},
				attributes: [["kode", "kode_operator"]],
			})

			let reseller = await pengirim.findOne({
				where: {
					pengirim: user.notelp,
				},
				include: "reseller",
			});

			var data = [];
			for (var i = 0; i < product.length; i++) {
				product[i]['markup'] = markup

				if (markup > 0) {
					var combine = "MP2." + kode_reseller + "." + product[i].kode_operator + "=" + markup + "." + reseller.reseller.pin;
				}else {
					var combine = "DELMP." + kode_reseller + "." + product[i].kode_operator + "." + reseller.reseller.pin;
				}

				data.push({
					tgl_entri: newDate,
					penerima: null,
					kode_reseller: reseller.reseller.kode,
					pengirim: reseller.pengirim,
					tipe_pengirim: "Y",
					pesan: combine,
					kode_terminal: "1",
					kode_transaksi: "",
					status: "0",
					tgl_status: newDate,
					is_jawaban: "0",
					service_center: "+62816124",
				})
			}

			let result = await models.inbox.bulkCreate(data)
			res.send(result)
		} catch (error) {
			res.send(error.message)
		}
	}

	static async changeMarkupProduct(req, res, next) {
		try {
			let user = req.logedInUser
			let {
				kode_reseller,
				kode_produk,
				markup,
			} = req.body

			let reseller = await pengirim.findOne({
				where: {
					pengirim: user.notelp,
				},
				include: "reseller",
			});

			if (markup > 0) {
				var combine = "MP2." + kode_reseller + "." + kode_produk + "=" + markup + "." + reseller.reseller.pin;
			}else {
				var combine = "DELMP." + kode_reseller + "." + kode_produk + "." + reseller.reseller.pin;
			}

			let data = inboxController.formatJson(reseller.reseller.kode, reseller.pengirim, combine);

			let result = await inbox.create(data);
			res.send(result);
		} catch (error) {
			res.send(error.message)
		}
	}
}

module.exports = inboxController;