const {
  produk
} = require('../models')

function getProduk(){
  produk.findAll({
    where:{
      kode_operator:'BYU'
    }
  }).then((response)=>{
  }).catch((error)=>{
  })
}