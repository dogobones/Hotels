$(window).load(function() {

  socket.on('actualizarPisos', function(pisos) {

    $("#pisoAgregarArea").html("");

    pisos.forEach(function(piso) {

      $("#pisoAgregarArea").append("<option>"+piso.piso+"</option>");

    });

    //Botón de pisos dinámico, controlar pisos, moverte de piso si ya no hay, etc...

  });

});
