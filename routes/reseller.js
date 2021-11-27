const router = require('express').Router()
const reseller = require('../controllers/resellerController')
const { isAuth } = require('../middleware/auth')

router.post('/editMarkup', isAuth, reseller.editMarkup)
router.get('/downline/:kode_upline', reseller.downline)
router.get('/reward', reseller.reward)
router.get('/komisi', isAuth, reseller.komisi)

router.get("/lr", reseller.listReseller)
router.get("/rc", reseller.listResellerc)
router.put("/ur/:id", reseller.updateReseller)
router.put("/ra/:id", reseller.resellerActive)
router.put("/rn/:id", reseller.resellerAction);
router.delete("/rd/:id", reseller.resellerRemove);
router.get("/gc/:id", reseller.resellerByCode);
router.get("/gd/:id", reseller.resellerByData);
router.delete("/md/:id", reseller.removeDevice);

module.exports = router