const path = require('path');
const pool = require(path.join('..','db'));

const controller = {};
controller.createsite = async (req, res) => {

var imagen="";
//console.log(req.files.LogoFile);
console.log(req);

if(req.files!=undefined){
 if(req.files.LogoFile!=undefined) {
//console.log(req.files.LogoFile);
  var fileLogo = req.files.LogoFile;
   fileLogo.mv(`./src/public/img/${fileLogo.name}`);
   rutaLogo=`/src/public/img/${fileLogo.name}`;
 }

 if(req.files.MapFile!=undefined) {
 //console.log(req.files.MapFile);
    var fileMap = req.files.MapFile;
    fileMap.mv(`./src/public/img/${fileMap.name}`);
    rutaMapa=`/src/public/img/${fileLogo.name}`;
  }
}
let nombreSitio = req.body.nombreSitio;
//console.log(nombreSitio);
const query = await pool.query("INSERT INTO Hoteles(nombre,mapa,logo) values(?,?,?)",[nombreSitio,rutaLogo,rutaMapa]);
const hotel = await pool.query("SELECT * FROM Hoteles WHERE id = ?",[query.insertId]);

res.redirect('/editsite/:hotelId');



};
module.exports = controller;
