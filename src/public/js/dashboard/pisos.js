$(window).load(function() {

  var allPisos = [];
  var defaultPiso = true;
  var preventLoop = true;

  socket.on('actualizarPisos', function(pisos) {

    $("#pisoAgregarArea").html("");
    $("#cambiarPiso").html("");

    allPisos = [];

    if(pisos.length > 0) {

      pisos.forEach(function(piso) {

        allPisos.push(piso.piso);

        $("#pisoAgregarArea").append("<option>"+piso.piso+"</option>");
        $("#cambiarPiso").append("<option>"+piso.piso+"</option>");

      });

      if(defaultPiso || allPisos.indexOf(pisoActual) < 0) {

        pisoActual = allPisos[0];
        defaultPiso = false;

      }

    } else {

      allPisos.push("Piso 1");

      pisoActual = allPisos[0];

      $("#pisoAgregarArea").append("<option>Piso 1</option>");
      $("#cambiarPiso").append("<option>Piso 1</option>");

    }

    areasDelPiso();

  });

  function areasDelPiso() {

    var areas = allAreas.filter(function (area) {

      return area.piso == pisoActual;

    });

    $(".blink").addClass("d-none");

    areas.forEach(function(area) {

      $("#area"+area.id).removeClass("d-none");

    });

    $("#piso").html("<i class='fas fa-building'></i> " + pisoActual);

    $("#pisoAgregarArea").val(pisoActual);
    $("#cambiarPiso").val(pisoActual);

    preventLoop = true;

    $("#pisoAgregarArea").trigger('change');
    $("#cambiarPiso").trigger('change');

    preventLoop = false;

  }

  $("#leftPiso").click(function() {

    var index = allPisos.indexOf(pisoActual);

    if(index > 0) {

      pisoActual = allPisos[index - 1];

      areasDelPiso();

    }

  });

  $("#cambiarPiso").on('change', function() {

    if(!preventLoop) {

      pisoActual = $("#cambiarPiso").val();

      $("#ElegirPiso").modal("hide");

      areasDelPiso();

    }

  });

  $("#rightPiso").click(function() {

    var index = allPisos.indexOf(pisoActual);

    if(index < allPisos.length - 1) {

      pisoActual = allPisos[index + 1];

      areasDelPiso();

    }

  });

});
