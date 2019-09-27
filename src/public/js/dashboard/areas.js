$(function() {

  socket.on('actualizarAreas', function(areas) {

    actualizarAreas(areas);

  });

  $("#AgregarAreaButton").click(function() {

    var nombre = $("#nombreArea").val();
    var estado = $("#estado").val();

    socket.emit('nuevaArea', {
      nombre: nombre,
      estado: estado,
      hotel_id: hotel_id
    });

    $("#AgregarArea").modal("hide");
    $("#nombreArea").val("");
    $("#equipos").val(null).trigger('change');

  });

  function actualizarAreas(areas) {

    $("#mapa").html(""); //Mejor añado sólo la nueva área no??? maybe...

    areas.forEach(function(area) {

      $("#mapa").append( "<div id='piso"+area.id+"' class='ui-widget-content resizable blink' style='overflow: hidden; background-color:#63B76C; border-color:#3AA655;'></div>" );

      $(".resizable").draggable({
        containment: "#mapa",
        snap: true
        });

      $(".resizable").resizable({
        containment: "#mapa",
        minHeight: 30,
        minWidth: 30
      });

      $("#piso"+area.id).append("<div style='font-weight: bold; text-align: left; font-size: 24px;'><p style='line-height : 24px;'>"+area.nombre+"</p></div>");

      //Asignar posiciones...

    });

  }

});
