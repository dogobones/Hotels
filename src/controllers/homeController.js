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
   fileLogo.mv(`./src/public/img/logos/${fileLogo.name}`);
   rutaLogo=`/img/logos/${fileLogo.name}`;
 }

 if(req.files.MapFile!=undefined) {
 //console.log(req.files.MapFile);
    var fileMap = req.files.MapFile;
    fileMap.mv(`./src/public/img/mapas/${fileMap.name}`);
    rutaMapa=`/img/mapas/${fileMap.name}`;
  }
}
let nombreSitio = req.body.nombreSitio;
//console.log(nombreSitio);
const query = await pool.query("INSERT INTO Hoteles(nombre,mapa,logo) values(?,?,?)",[nombreSitio,rutaMapa,rutaLogo]);

res.redirect('/editsite/'+query.insertId);



};

controller.searchallsites= async(req, res)=>{
const hotels = await pool.query("SELECT * FROM Hoteles");
//console.log(hotels);
res.json(hotels);
}


module.exports = controller;
