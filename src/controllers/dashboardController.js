const path = require('path');
const pool = require(path.join('..','db'));

const controller = {};

controller.editsite = async (req, res) => {
  try {
    const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = 1");
    console.log(hotel);
  } catch(err) {
    console.log(err);
  }
  res.render('../views/dashboard/editsite', {
     hotel: {
       "left": 15,
       "top": 15,
       "width": 15,
       "height": 15,
     }
  });
};

module.exports = controller;
