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
   rutaLogo=`/img/${fileLogo.name}`;
 }

 if(req.files.MapFile!=undefined) {
 //console.log(req.files.MapFile);
    var fileMap = req.files.MapFile;
    fileMap.mv(`./src/public/img/${fileMap.name}`);
    rutaMapa=`/img/${fileMapa.name}`;
  }
}
let nombreSitio = req.body.nombreSitio;
//console.log(nombreSitio);
const query = await pool.query("INSERT INTO Hoteles(nombre,mapa,logo) values(?,?,?)",[nombreSitio,rutaLogo,rutaMapa]);

res.redirect('/editsite/'+query.insertId);



};
module.exports = controller;
