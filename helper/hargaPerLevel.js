const models = require('../models')
const {
    Op
} = require('sequelize')

function levelO(produk) {
    return new Promise(async function (resolve, reject) {
        let produk = await models.produk.findAll({
            attributes: ['nama', 'harga_jual'],
            where: {
                kode: 'AIS10'
            }
        })
        if (produk.length > 0) {
            resolve(produk)
        } else {
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelMS(produk) {
    return new Promise(async function (resolve, reject) {
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where: {
                [Op.or]: [{
                    kode: 'M'
                }, {
                    kode: 'S'
                }],
            }
        })
        if (level) {
            levelO(produk)
                .then(response => {
                    response.forEach(produk => {
                        produk.harga_jual = produk.harga_jual + level.selisih_harga
                    })
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        } else {
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelD(produk) {
    return new Promise(async function (resolve, reject) {
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where: {
                kode: 'D',
            }
        })
        if (level) {
            levelMS(produk)
                .then(response => {
                    response.forEach(produk => {
                        produk.harga_jual = produk.harga_jual + level.selisih_harga
                    })
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        } else {
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelA(produk) {
    return new Promise(async function (resolve, reject) {
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where: {
                kode: 'A',
            }
        })
        if (level) {
            levelD(produk)
                .then(response => {
                    response.forEach(produk => {
                        produk.harga_jual = produk.harga_jual + level.selisih_harga
                    })
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        } else {
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelR(produk) {
    return new Promise(async function (resolve, reject) {
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where: {
                kode: 'R',
            }
        })
        if (level) {
            levelA(produk)
                .then(response => {
                    response.forEach(produk => {
                        produk.harga_jual = produk.harga_jual + level.selisih_harga
                    })
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        } else {
            reject('Level Tidak Terdaftar')
        }
    })
}

function hargaMarkUp(produk, produk_upline, user_markUp) {
    for (let i = 0; i < produk.length; i++) {
        for (let j = 0; j < produk_upline.length; j++) {
            if (produk[i].kode == produk_upline[j].kode_produk) {
                produk[i].harga_jual = produk[i].harga_jual + produk_upline[j].markup
            }
        }
    }
    // markup produk sesuai dengan markup dari masing2 reseller
    produk.forEach(produk => {
        produk.harga_jual = produk.harga_jual + user_markUp
    })

    return produk
}

function hargaMarkUpOperator(produk, produk_upline, user_markUp) {
    for (let i = 0; i < produk.length; i++) {
        for (let j = 0; j < produk_upline.length; j++) {
            if (produk[i].kode_operator == produk_upline[j].kode_operator) {
                produk[i].harga_jual = produk[i].harga_jual + produk_upline[j].markup;
            }
        }
    }
    // markup produk sesuai dengan markup dari masing2 reseller
    produk.forEach((produk) => {
        produk.harga_jual = produk.harga_jual + user_markUp;
    });

    return produk;
}

module.exports = {
    levelMS,
    levelD,
    levelA,
    levelR,
    hargaMarkUp,
    hargaMarkUpOperator
}