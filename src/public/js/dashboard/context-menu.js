$(window).load(function() {

  $.contextMenu({
      selector: '.ui-widget-content',
      callback: function(key, options) {
          var m = "clicked: " + key;
          window.console && console.log(m) || alert(m);
      },
      items: {
          "ver": {name: "Ver detalles", icon: "fas fa-eye"},
          "nombre": {name: "Cambiar nombre", icon: "fas fa-edit"},
          "equipos": {name: "Gestionar equipos", icon: "fas fa-broadcast-tower"},
          "split": "---------",
          "eliminar": {name: "Eliminar área", icon: "fas fa-trash-alt"}
      }
  });

  $('.ui-widget-content').on('click', function(e) {
      console.log('clicked', this);
  });

});
