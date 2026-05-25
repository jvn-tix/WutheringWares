const express = require('express');

const router = express.Router();

const authMiddleware =
    require('../middleware/authMiddleware');

const adminMiddleware =
    require('../middleware/adminMiddleware');

const {
    getEquipments,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment
} = require('../controllers/equipmentController');

router.get(
    '/equipments',
    getEquipments
);

router.get(
    '/equipments/:id',
    getEquipmentById
);

const upload = require('../middleware/uploadMiddleware');

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.single('image'),
  createEquipment
);

router.put(
    '/equipments/:id',
    authMiddleware,
    adminMiddleware,
    updateEquipment
);

router.delete(
    '/equipments/:id',
    authMiddleware,
    adminMiddleware,
    deleteEquipment
);

module.exports = router;