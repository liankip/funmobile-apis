const router = require('express').Router()
const olahdata = require('../controllers/olahdataController')
const {
    isAuth
} = require("../middleware/auth");

router.post('/pulsaperreseller', isAuth, olahdata.pulsaPerReseller)
router.get('/getProduk', isAuth, olahdata.getProduk)

router.get('/banner', olahdata.banner)
router.get('/info', olahdata.info)

router.get("/getOperator", isAuth, olahdata.getProductbyProvider);

router.get("/listOperator", isAuth, olahdata.listMarkuoperator);
router.post("/addeditoperator", isAuth, olahdata.addEditMarkupoperator);

router.get("/listProduct", isAuth, olahdata.listMarkuproduct);
router.post("/addeditproduct", isAuth, olahdata.addEditMarkupproduct);

router.get('/allproduct', olahdata.allProduct);
router.get('/getProduct/:id', olahdata.productByCode);
router.put('/getProduct/:id', olahdata.updateProduct);
router.delete('/removeproduct/:id', olahdata.removeProduct);

router.get('/provider', olahdata.allProvider)
router.get('/provider/:id', olahdata.getProvider)
router.post('/provider', olahdata.createProvider)
router.put('/provider/:id', olahdata.updateProvider)
router.delete('/provider/:id', olahdata.deleteProvider)

module.exports = router