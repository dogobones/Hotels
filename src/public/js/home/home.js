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
      $('#sitesContainer').html('');
      data.forEach(function(element){
        $("#sitesContainer").append( "<div id="+element.id+" class='empresa m-1  "+element.nombre+ "' ><img class='BnW ' style='width:9.4em; height:9.4em' src= "+element.logo+" alt=''></div>" );
        $('.BnW').on('error',function(){
          $(this).attr('src','/img/logos/DefaultLogo.png');

        });
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

var oklogo,okmapa;
 $('#LogoFile').on('change',function(){
   var fileInput = $('#LogoFile');
   var filePath = $('#LogoFile').value;
    var size=$('#LogoFile')[0].files[0].size;
   console.log(size);
   var extension=$('#LogoFile').val().replace(/^.*\./, '');

   if(extension != 'jpg'&& extension != 'jpeg' && extension != 'png'){
     console.log("Archivo incorrecto "+ extension +" No es valido");
     $('#lblogo').removeClass('btn-warning');
     $('#lblogo').addClass('btn-danger');
     $('#txtLogo').text('Seleccione otro archivo');
     oklogo=false;
     return false;
   }else{
     console.log("Correcto");
     $('#lblogo').removeClass('btn-danger');
     $('#lblogo').removeClass('btn-warning');
     $('#lblogo').addClass('btn-success');
     $('#txtLogo').text('Logo cargado');
     oklogo=true;
   }
});

$('#MapFile').on('change',function(){
  var fileInput = $('#MapFile');
  var filePath = $('#MapFile').value;
  var extension=$('#MapFile').val().replace(/^.*\./, '');

  if(extension != 'jpg'&& extension != 'jpeg' && extension != 'png'){
    console.log("Archivo incorrecto "+ extension +" No es valido");
    $('#lbmap').removeClass('btn-warning');
    $('#lbmap').addClass('btn-danger');
    $('#txtMap').text('Seleccione otro archivo');
    okmapa=false;

    return false;
  }else{
    console.log("Correcto");
    var size=$('#MapFile')[0].files[0].size;
   //console.log(size);
    $('#lbmap').removeClass('btn-danger');
    $('#lbmap').removeClass('btn-warning');
    $('#lbmap').addClass('btn-success');
    $('#txtMap').text('Mapa cargado ('+size+'Kb)');
    okmapa=true;
  }
});

});
