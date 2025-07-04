const express = require('express');
const { verifyToken, roleCheck } = require('../middlewares/authMiddleware');
const { registerInsitute, getAllInstitutes, specificInstitute, updateInstitute, deleteInstitute, searchInstitute, upload } = require('../controllers/instituteController');
const router = express.Router();

router.post('/institute', upload.single('logo'), verifyToken, roleCheck('admin'), registerInsitute);

router.get('/institutes', verifyToken, roleCheck('admin'), getAllInstitutes);

router.get('/institute/:id', verifyToken, roleCheck('admin'), specificInstitute);

router.put('/institute/:id', verifyToken, roleCheck('admin'), updateInstitute);

router.delete('/institute/:id', roleCheck('admin'), deleteInstitute);

router.get('/institutes', verifyToken, roleCheck('admin'), searchInstitute);


module.exports = router;
