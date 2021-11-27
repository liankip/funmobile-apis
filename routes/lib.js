const router = require('express').Router()
const libController = require("../controllers/libController");

router.post("/info", libController.createInfo);
router.get("/info", libController.listInfo);
router.get("/info/:id", libController.getInfo);
router.put("/info/:id", libController.putInfo);
router.delete("/info/:id", libController.deleteInfo);

router.post("/banner", libController.createBanner);
router.get("/banner", libController.listBanner);
router.get("/banner/:id", libController.getBanner);
router.put("/banner/:id", libController.putBanner)
router.delete("/banner/:id", libController.deleteBanner)

router.post("/flash", libController.createFlash);
router.get("/flash", libController.listFlash);
router.get("/flash/:id", libController.getFlash);
router.put("/flash/:id", libController.putFlash);
router.delete("/flash/:id", libController.deleteFlash);

router.post("/service", libController.createService);
router.get("/service", libController.listService);
router.get("/service/:id", libController.getService);
router.put("/service/:id", libController.putService);
router.delete("/service/:id", libController.deleteService);

router.post("/reward", libController.createReward);
router.get("/reward", libController.listReward);
router.get("/reward/:id", libController.getReward);
router.put("/reward/:id", libController.putReward);
router.delete("/reward/:id", libController.deleteReward);

module.exports = router