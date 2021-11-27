const router = require('express').Router()
const dashboardController = require('../controllers/dashboardController');

router.get("/counttrx", dashboardController.countTrx);
router.get("/counttrxd", dashboardController.countTrxd);
router.get("/ca", dashboardController.countALl)
router.get("/chartrx", dashboardController.chartTrx);
router.get("/listinbox", dashboardController.inboxList);
router.get("/listoutbox", dashboardController.outboxList);
router.get("/profit/:start/:end", dashboardController.profit);

router.get("/listtrxs", dashboardController.trxS);
router.get("/listtrxp", dashboardController.trxP);
router.get("/listtrxf", dashboardController.trxF);

module.exports = router
