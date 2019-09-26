const path = require('path');
const pool = require(path.join('..','db'));

const controller = {};

controller.editsite = async (req, res) => {
    const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = ?", req.params.hotelId);
    res.render('../views/dashboard/editsite', {
       hotel: hotel[0]
    });
};

controller.salvarMovimientos = async (req, res) => {
    await pool.query("UPDATE Hoteles SET `left` = ?, top = ?, width = ?, height = ? WHERE id = ?", [
      req.body.left, req.body.top, req.body.width, req.body.height, req.body.sitio
    ]);
    res.json("Ok");
};

module.exports = controller;
