$(window).load(function() {

  actualizarMapa();

  $("#mapa").draggable({
    containment: "#containment-wrapper",
    stop: function(e, ui) { ajustarMapa(1); }
  });

  $("#mapa").resizable({
    containment: "#containment-wrapper",
    minHeight: 250,
    minWidth: 400,
    stop: function(e, ui) { ajustarMapa(2); }
  });

  if($(window).width() < 700) {

    $("#agregarHabitacion").attr("disabled", true);
    $("#salvarMovimientos").attr("disabled", true);
    $("#mapa").draggable("destroy");
    $("#mapa").resizable("destroy");

  }

  socket.on('actualizarMapa', function(hotel) {

    width = hotel[0].width;
    height = hotel[0].height;
    left = hotel[0].left;
    _top = hotel[0].top;
    hotel_mapa = hotel[0].mapa;

    actualizarMapa();

  });

  function actualizarMapa() {

    $("#mapa").css("width", width + "%");
    $("#mapa").css("height", height + "%");
    $("#mapa").css("left", left + "%");
    $("#mapa").css("top", _top + "%");
    $("#mapa").css("background-image", "linear-gradient(rgba(0, 0, 0, 0.350), rgba(0, 0,0, 0.350)), url(" + hotel_mapa + ")");
    $("#mapa").css("background-position", "center center");
    $("#mapa").css("background-repeat", "no-repeat");
    $("#mapa").css("background-size", "100% 100%");
    $("#mapa").css("background-color", "black");

  }

  function ajustarMapa(action) {

    $("#salvarMovimientos").addClass("active");
    $(".descartar").removeClass("d-none");

    var anchoBase = $("#containment-wrapper").width();
    var largoBase = $("#containment-wrapper").height();
    var anchoMapa = $("#mapa").width();
    var largoMapa = $("#mapa").height();
    var leftMapa = $("#mapa").css("left").split("px")[0];
    var topMapa = $("#mapa").css("top").split("px")[0];
    if(parseInt(leftMapa) < 0) leftMapa = 0;
    if(parseInt(topMapa) < 0) topMapa = 0;

    width = Math.ceil(((anchoMapa * 100) / anchoBase));
    height = Math.ceil(((largoMapa * 100) / largoBase));
    left = Math.ceil(((leftMapa * 100) / anchoBase));
    _top = Math.ceil(((topMapa * 100) / largoBase));

    if(action == 1) {

      $("#mapa").css("left", left + "%");
      $("#mapa").css("top", _top + "%");

    } else {

      $("#mapa").css("width", width + "%");
      $("#mapa").css("height", height + "%");

    }

  }

  $("#salvarMovimientos").click(function() {

    $("#salvarMovimientos").removeClass("active");
    $(".descartar").addClass("d-none");

    socket.emit('sincronizacion', {

        sitio: hotel_id,
        width: width,
        height: height,
        left: left,
        _top: _top,
        allAreas: allAreas

    });

    toastr.success('', '!Mapa sincronizado con éxito!', {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "1500",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    });

  });

});
