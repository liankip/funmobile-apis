const router = require('express').Router()
const authController = require("../controllers/authController");

router.post("/signin", authController.authSignindashboard);
router.post("/signinr", authController.authSigninreport);
router.post("/getotp", authController.authSendotp);
router.post("/otp/:token/:otp", authController.authOtp);
router.get("/lauth", authController.authManage);
router.post("/cauth", authController.authCreated);
router.get("/gauth/:id", authController.authManageid);
router.put("/uauth/:id", authController.authUpdate);
router.delete("/dauth/:id", authController.authDelete);

module.exports = router