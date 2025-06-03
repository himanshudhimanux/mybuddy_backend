const express = require('express');
const router = express.Router();
const {
  getPurchaseDetails,
  getSmsDetails,
  getStudentDocuments
} = require('../controllers/studentDetailsController');

router.get('/student/purchase-details/:studentId', getPurchaseDetails);
router.get('/student/sms-details/:studentId', getSmsDetails);
router.get('/student/documents/:studentId', getStudentDocuments);

module.exports = router;
