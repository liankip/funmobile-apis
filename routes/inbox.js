const router = require("express").Router()
const inbox = require('../controllers/inboxController')
const {
  isAuth
} = require("../middleware/auth");

router.post("/changemarkupoperator", isAuth, inbox.changeMarkupDownline);
router.post("/changemarkupproduct", isAuth, inbox.changeMarkupProduct);

module.exports = router