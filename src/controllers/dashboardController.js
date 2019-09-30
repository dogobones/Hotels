const path = require('path');
const pool = require(path.join('..','db'));

const controller = {};

controller.editsite = async (req, res) => {
    const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = ?", req.params.hotelId);
    res.render('../views/dashboard/editsite', {
       hotel: hotel[0]
    });
};

module.exports = controller;
