const db = require('../config/db');

exports.getEquipments = (req, res) => {

    db.query(
        'SELECT * FROM equipments',
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
};

exports.getEquipmentById = (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM equipments WHERE id = ?',
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result[0]);
        }
    );
};

exports.addEquipment = (req, res) => {

    if(req.user.role !== 'admin'){
        return res.sendStatus(403);
    }

    const {
        name,
        type,
        description,
        stock,
        image,
        price
    } = req.body;

    if(!name || !type){
        return res.status(400).json({
            message: 'All fields required'
        });
    }

    if(name.length < 3){
        return res.status(400).json({
            message:'Name too short'
        });
    }

    if(price < 0){
        return res.status(400).json({
            message:'Invalid price'
        });
    }

    if(stock < 0){
        return res.status(400).json({
            message:'Invalid stock'
        });
    }

    db.query(
        `INSERT INTO equipments
        (name,type,description,stock,image,price)
        VALUES (?,?,?,?,?,?)`,
        [
            name,
            type,
            description,
            stock,
            image,
            price
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: 'Equipment added'
            });
        }
    );
};

exports.updateEquipment = (req, res) => {

    if(req.user.role !== 'admin'){
        return res.sendStatus(403);
    }

    const id = req.params.id;

    const {
        name,
        type,
        description,
        stock,
        image,
        price
    } = req.body;

    db.query(
        `UPDATE equipments
        SET
        name=?,
        type=?,
        description=?,
        stock=?,
        image=?,
        price=?
        WHERE id=?`,
        [
            name,
            type,
            description,
            stock,
            image,
            price,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:'Equipment updated'
            });
        }
    );
};

exports.deleteEquipment = (req, res) => {

    if(req.user.role !== 'admin'){
        return res.sendStatus(403);
    }

    const id = req.params.id;

    db.query(
        'DELETE FROM equipments WHERE id=?',
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:'Equipment deleted'
            });
        }
    );
};

const image = req.file
  ? `/uploads/${req.file.filename}`
  : null;


const page = parseInt(req.query.page) || 1;

const limit = parseInt(req.query.limit) || 10;

const offset = (page - 1) * limit;

const [equipments] = await db.query(
  'SELECT * FROM equipments LIMIT ? OFFSET ?',
  [limit, offset]
);

const search = req.query.search || '';

const [equipments] = await db.query(
  'SELECT * FROM equipments WHERE name LIKE ?',
  [`%${search}%`]
);

