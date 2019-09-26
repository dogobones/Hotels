const path = require('path');
const pool = require(path.join('..','db'));

const controller = {};
controller.createsite = async (req, res) => {
try {
console.log("hola");
var imagen="";
console.log(req.files.LogoFile);
console.log(req.files.MapFile);
 if(req.files.file!=undefined) {

   let file = req.files.file;

   file.mv(`.//src//public//img//${file.name}`);

   imagen=file.name;

 }

    //const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = 1");
  } catch(err) {
    console.log(err);
  }

};
module.exports = controller;
