function errorHandling(err, req, res, next){
    if(err.name == 'login'){
        res.status(500).json({pesan:err.errors})
    }else if(err.name == 'register'){
        res.status(500).json({pesan:err.errors})
    }else if(err.name == 'SequelizeConnectionError'){
        res.status(500).json({"rc":"05","pesan":"GAGAL Koneksi ke DB "})
    }else{}
}

module.exports = errorHandling