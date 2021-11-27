const router = require('express').Router()
const reportController = require('../controllers/reportController')
const {
    isAuth
} = require('../middleware/auth')

router.get('/transaction', reportController.reportTransaction)
router.get('/detailtransaction/:id', reportController.getTransaction)
router.delete('/removetransaction/:id', reportController.removeTransaction)

router.get('/deposit/', reportController.reportDeposit)
router.get('/detaildeposit/:id', reportController.getDeposit)
router.get('/removedeposit/:id', reportController.removeDeposit)

router.get('/mutation', reportController.reportMutation)
router.get('/detailmutation/:id', reportController.getMutation)
router.delete('/removemutation/:id', reportController.removeMutation)

router.get('/commission', reportController.reportCommission)

router.get('/mutationwinpay', reportController.mutationWinpay)
router.get('/mutationwinpay/:id', reportController.getMutationwinpay)

module.exports = router