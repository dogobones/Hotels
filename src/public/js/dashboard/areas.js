$(window).load(function() {

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

    allAreas = areas;

    areas.forEach(function(area) {

      $("#area"+area.id ).remove();

      $("#mapa").append( "<div id='area"+area.id+"' class='ui-widget-content resizable blink' style='overflow: hidden;'></div>" );

      $(".resizable").draggable({
        containment: "#mapa",
        snap: true,
        stop: function(e, ui) { ajustarArea($(this).attr("id"), 1); }
        });

      $(".resizable").resizable({
        containment: "#mapa",
        minHeight: 40,
        minWidth: 40,
        stop: function(e, ui) { ajustarArea($(this).attr("id"), 2); }
      });

      $("#area"+area.id).append("<div style='font-weight: bold; text-align: left; font-size: 30%;'><p style='line-height : 24px;'>"+area.nombre+"</p></div>");

      $("#area"+area.id).css("width", area.width + "%");
      $("#area"+area.id).css("height", area.height + "%");
      $("#area"+area.id).css("left", area.left + "%");
      $("#area"+area.id).css("top", area.top + "%");
      $("#area"+area.id).css("background-color", area.color);
      $("#area"+area.id).css("border", "2px solid " + area.border);

    });

  }

  function ajustarArea(areaId, action) {

    var anchoBase = $("#mapa").width();
    var largoBase = $("#mapa").height();
    var anchoArea = $("#" + areaId).width();
    var largoArea = $("#" + areaId).height();
    var leftArea = $("#" + areaId).css("left").split("px")[0];
    var topArea = $("#" + areaId).css("top").split("px")[0];
    if(parseInt(leftArea) < 0) leftArea = 0;
    if(parseInt(topArea) < 0) topArea = 0;

    var widthArea = Math.ceil(((anchoArea * 100) / anchoBase));
    var heightArea = Math.ceil(((largoArea * 100) / largoBase));
    var leftArea = Math.round(((leftArea * 100) / anchoBase));
    var topArea = Math.round(((topArea * 100) / largoBase));

    var res = allAreas.filter(function (area) {

      return area.id == areaId.split("area")[1];

    });

    if(action == 1) {

      $("#" + areaId).css("left", leftArea + "%");
      $("#" + areaId).css("top", topArea + "%");
      res[0].left = leftArea;
      res[0].top = topArea;

    } else {

      $("#" + areaId).css("width", widthArea + "%");
      $("#" + areaId).css("height", heightArea + 1 + "%");
      res[0].width = widthArea;
      res[0].height = heightArea + 1;

    }

  }

});
