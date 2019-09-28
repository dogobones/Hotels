$(function(){
$('#Añadirsitio').click(function(){
  $('#modalañadir').modal('show');
});

$('#Escogersitio').click(function(){
  $.ajax({
    type:"POST",
    url:"/searchallsites",
    //data:"",
    success:function(data){
      //console.log(data);
      data.forEach(function(element){


        $("#sitesContainer").append( "<div id="+element.id+" class='empresa p-1' ><img class='BnW' style='width:9.4em; height: 9.4em' src= "+element.logo+" alt=''></div>" );
        $('#'+element.id).on('click',function(e){
          //console.log('clicked', this.id);

        location.href ="/editsite/"+this.id;//ID del elemento escogido
        });

      });
      ///$("#sitesContainer").append( "<div style='overflow: hidden; background-color:#1DB28C; border-color:#1DE0AF;'></div>" );
    //  console.log("funciona");
    $('#modalEscoger').modal('show');
    },
    error:function(error){
      console.log(error);
    }
  });
});
/*  $('#LogoFile').on('change',function(){
  var fileInput = $('#LogoFile');
  fileValidation(fileInput);
});*/


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
