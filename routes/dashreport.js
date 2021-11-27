const router = require('express').Router()
const dashreportController = require('../controllers/dashreportController');
const { isAuth } = require('../middleware/auth')

router.get("/counttrxr", isAuth, dashreportController.countTrxr);
router.get("/chartrxr", isAuth, dashreportController.chartTrxr);
router.get("/listinbox", isAuth, dashreportController.inboxListr);
router.get("/listoutbox", isAuth, dashreportController.outboxListr);
router.get('/transaction/', isAuth, dashreportController.rTransaction)
router.get('/deposit/', isAuth, dashreportController.rDeposit)
router.get('/mutation', isAuth, dashreportController.rMutation)
router.get('/commission', isAuth, dashreportController.rCommission)
router.get('/profile', isAuth, dashreportController.getProfile)

module.exports = router
