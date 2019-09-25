$(function(){
$('#Añadirsitio').click(function(){
  $('#modalañadir').modal('show');
});

$('#Escogersitio').click(function(){
  $('#modalEscoger').modal('show');
});
/*  $('#LogoFile').on('change',function(){
  var fileInput = $('#LogoFile');
  fileValidation(fileInput);
});*/
$('.empresa').on('click',function(){
location.href ="/editsite";//TEMPORAL, hay que añadir la ruta al controlador
});

});
function fileValidation(fileInput){
var fileInput = $('#LogoFile');
var filePath = $('#LogoFile').value;
 var size=$('#LogoFile')[0].files[0].size;
console.log(size);
var extension=$('#LogoFile').val().replace(/^.*\./, '');

if(extension != 'jpg'&& extension != 'jpeg' && extension != 'png'){
  console.log("Archivo incorrecto "+ extension +" No es valido");

  return false;
}else{
  console.log("Correcto");

}
}
