const express = require('express');
const router = express.Router();
const {
  getPurchaseDetails,
  createPurchaseDetail,
  getSmsDetails,
  createSmsDetail,
  getStudentDocuments,
  createStudentDocument
} = require('../controllers/studentDetailsController');

// 📦 Purchase Details
router.get('/student/purchase-details/:studentId', getPurchaseDetails);
// router.post('/student/purchase-details', createPurchaseDetail); // future use

// 📩 SMS Details
router.get('/student/sms-details/:studentId', getSmsDetails);
// router.post('/student/sms-details', createSmsDetail); // future use

// 📄 Student Documents
router.get('/student/documents/:studentId', getStudentDocuments);
// router.post('/student/documents', createStudentDocument); // future use

module.exports = router;
