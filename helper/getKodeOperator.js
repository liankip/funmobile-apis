const {operator} = require('../models')
const {
    Op
  } = require('sequelize')
const e = require('express')

async function getKodeOperator(kriteria1,kriteria2){
    try {
        if(kriteria1 && kriteria2){
            let data = await operator.findAll({
                where:{
                    nama: {
                        [Op.like]: `%${kriteria1}%`,
                        [Op.substring]: `%${kriteria2}%`
                    }
                }
            })
            return data
        }else{
            let data = await operator.findAll({
                where:{
                    nama: {
                        [Op.like]: `%${kriteria1}%`, 
                    }
                }
            })
            return data
        }
        
    } catch (error) {
        return error
    }
}

module.exports = {getKodeOperator}