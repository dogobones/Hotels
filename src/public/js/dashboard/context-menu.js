$(window).load(function() {

  var areaActual;

  $.contextMenu({
      selector: '.ui-widget-content',
      callback: function(key, options) {

        var areaId = this[0].id;

        areaActual = allAreas.filter(function (area) {

          return area.id == areaId.split("area")[1];

        });

          switch(key) {

            case "estado":

              $("#nuevoEstado").val(areaActual[0].estado);

              $("#CambiarEstado").modal("show");

              break;

            case "eliminar":

              $("#EliminarArea").modal("show");

              break;

          }

      },
      items: {
          "ver": {name: "Ver detalles", icon: "fas fa-eye"},
          "nombre": {name: "Cambiar nombre", icon: "fas fa-edit"},
          "estado": {name: "Cambiar estado", icon: "fas fa-sync-alt"},
          "equipos": {name: "Gestionar equipos", icon: "fas fa-broadcast-tower"},
          "split": "---------",
          "eliminar": {name: "Eliminar habitación", icon: "fas fa-trash-alt"}
      }
  });

  $("#CambiarEstadoButton").click(function() {

    var estado = $("#nuevoEstado").val();

    socket.emit('nuevoEstado', {

      estado: estado,
      area: areaActual[0].id,
      hotel_id: hotel_id

    });

    $("#CambiarEstado").modal("hide");

  });

  $("#EliminarAreaButton").click(function() {

    socket.emit('eliminarArea', {

      area: areaActual[0].id,
      hotel_id: hotel_id

    });

    $("#EliminarArea").modal("hide");

  });

});
