const express = require("express");
const { 
    createBatchClass, 
    getBatchClasses, 
    getBatchClassById, 
    updateBatchClass, 
    deleteBatchClass 
} = require("../controllers/batchClassController");
const { verifyToken, roleCheck } = require("../middlewares/authMiddleware");
const router = express.Router();


// Routes
router.post("/batch-class", verifyToken, roleCheck('admin'), createBatchClass);
router.get("/batch-classes", verifyToken, roleCheck('admin'), getBatchClasses);
router.get("/batch-class/:id", verifyToken, roleCheck('admin'), getBatchClassById);
router.put("/batch-class/:id", verifyToken, roleCheck('admin'), updateBatchClass);
router.delete("/batch-class/:id", verifyToken, roleCheck('admin'), deleteBatchClass);

module.exports = router;