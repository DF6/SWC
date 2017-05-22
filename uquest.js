var uquest=angular.module('uquest',['ngRoute']);
uquest.config(function($routeProvider){
  $routeProvider
            .when("/", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "portada.html"
            })
            .when("/admincreacion", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "admincreacion.html"
            })
            .when("/crear", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "crearencuesta.html"
            })
            .when("/fecha", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "fecha.html"
            })
            .when("/compartir", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "compartir.html"
            })
            .when("/finalizar", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "finalizarencuesta.html"
            })
            .when("/nuevalista", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "preguntalista.html"
            })
            .when("/opcion", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "opcion.html"
            })
            .when("/nuevarespbreve", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "preguntarespbreve.html"
            })
            .when("/adminport", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "adminport.html"
            })
            .when("/admin", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "administracion.html"
            })
            .when("/votarport", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "votarport.html"
            })
            .when("/votar", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "votar.html"
            })
            .when("/elegirtipo", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "eleccionquest.html"
            })
            .when("/questcena", {
                controller: "uquestCtrl",
                controllerAs: "vm",
                templateUrl: "questcena.html"
            });
});
uquest.controller("navuquest", function($location){
        var map = this;
        map.estoy = function(ruta){
            return $location.path() == ruta;
        }
})
uquest.controller("uquestCtrl",function(uquestFactory, $http){
  var uq=this;
  uq.preguntas=uquestFactory.getPreguntas();
  uq.pass=uquestFactory.pass;
  uq.pregunta=uquestFactory.preguntaTemp;
  uq.opcion="";
  uq.opciones=[];
  uq.fecha=uquestFactory.fecha;
  uq.encu="";
  uq.fecha1=uquestFactory.fecha1;
  uq.fecha2=uquestFactory.fecha2;
  uq.multipleSwitch=function(valor)
  {
    uquestFactory.multiple=valor;
  }
  uq.consultaSwitch=function()
  {
    return uquestFactory.multiple;
  }
  uq.validarPass=function()
  {
    if(uq.pass=="")
    {
      Materialize.toast('Contrase&ntilde;a inexistente', 5000, 'rounded');
    }else{
      uquestFactory.pass=uq.pass;
      switch(uquestFactory.multiple)
      {
        case 1:window.location="#/elegirtipo";
              break;
        case 2:window.location="#/questcena";
              break;
        case 3:window.location="#/nuevalista";
              break;
        case 4:window.location="#/nuevarespbreve";
              break;
        case 5:window.location="#/elegirtipo";
              break;
        case 0:window.location="#/crear";
              break;
      }
    }
  }
  uq.validarPreguntas=function()
  {
    if(uq.preguntas.length==0)
    {
      Materialize.toast('Sin preguntas', 5000, 'rounded');
    }else{
      uquestFactory.setPreguntas(uq.preguntas);
      window.location="#/fecha";
    }
  }
  uq.guardarPregunta=function(tipo)
  {
    if(tipo=='Lista')
    {
      if(uq.pregunta=="")
      {
        Materialize.toast('Debes rellenar la pregunta', 5000, 'rounded');
      }else if(uquestFactory.getOpciones().length==0)
      {
        Materialize.toast('Necesitas m&aacute;s opciones', 5000, 'rounded');
      }else{
        uq.opciones=uquestFactory.getOpciones();
        uq.preguntas.push([uq.pregunta,"Lista",uq.opciones]);
        if(uquestFactory.multiple==5)
        {
          window.location="#/crear";
        }else{
          window.location="#/fecha";
        }
      }
    }else if(tipo=='Breve'){
      if(uq.pregunta=="")
      {
        Materialize.toast('Debes rellenar la pregunta', 5000, 'rounded');
      }else{
        uq.preguntas.push([uq.pregunta,"Breve"]);
        if(uquestFactory.multiple==5)
        {
          window.location="#/crear";
        }else{
          window.location="#/fecha";
        }
      }
    }else{
        Materialize.toast('Error desconocido', 5000, 'rounded');
    }
    uquestFactory.preguntaTemp="";
    uquestFactory.borraTodasOpc();
  }
  uq.revisaPreguntas=function(tipo)
  {
    if(uq.preguntas.length<10)
    {
      if(tipo=='Lista')
      {
        window.location="#/nuevalista";
        Materialize.toast('Con la pregunta tipo lista podr&aacute;s responder eligiendo entre varias opciones', 5000, 'rounded');
      }else if(tipo=='Breve'){
        window.location="#/nuevarespbreve";
        Materialize.toast('Con la pregunta tipo respuesta breve podr&aacute;s enviar una respuesta escrita a la pregunta', 5000, 'rounded');
      }else{
        Materialize.toast('Error inesperado', 5000, 'rounded');
      }
    }else{
      Materialize.toast('Muchas preguntas', 5000, 'rounded');
    }
  }
  uq.opci=function()
  {
    return uquestFactory.getOpciones();
  }
  uq.revisaOpciones=function()
  {
    if(uq.opciones.length<10)
    {
      uquestFactory.preguntaTemp=uq.pregunta;
      window.location="#/opcion";
    }else{
      Materialize.toast('Diez opciones es suficiente', 5000, 'rounded');
    }
  }
  uq.guardarOpcion=function()
  {
    if(uq.opcion=="")
    {
      Materialize.toast('Debes rellenar la opci&oacute;n', 5000, 'rounded');
    }else{
      if(uquestFactory.anadirOpcion(uq.opcion))
      {
        window.location="#/nuevalista";
      }else{
        Materialize.toast('Esa opci&oacute;n ya existe', 5000, 'rounded');
      }

    }
  }
  uq.guardarFecha=function()
  {
    if(document.getElementsByClassName("datepicker")[0].value=="")
    {
      Materialize.toast('Debes elegir alguna fecha', 5000, 'rounded');
    }else{
      uquestFactory.fecha=document.getElementsByClassName("datepicker")[0].value;
      window.location="#/finalizar";
    }
  }
  uq.guardarFechaCena=function()
  {
    uquestFactory.fecha1=document.getElementById("d1").value;
    uquestFactory.fecha2=document.getElementById("d2").value;
    uq.fecha1=uquestFactory.fecha1;
    uq.fecha2=uquestFactory.fecha2;
  }
  uq.enviarEncuesta=function()
  {

    $http.post("enviarencuesta.php", {pass: uquestFactory.pass, fecha:uquestFactory.fecha, preguntas: uquestFactory.preguntas})
            .success(function(respuesta){
                console.log("Conectado con éxito");
                window.location="#/compartir";
            })
            .error(function(respuesta){
                console.log("Error al conectar con la base de datos");
                Materialize.toast('Error al conectar con la base de datos',5000,'rounded');
            });
  }
  uq.borraOpcion=function(num)
  {
    uquestFactory.borraOpcion(num);
  }
  uq.borraTodo=function()
  {
    uquestFactory.borraTodo();
    uquestFactory.pass="";
    uquestFactory.fecha="";
  }
  uq.buscarEncuesta=function()
  {
    if(uq.encu=="" || uq.encu.length!=10)
    {
      Materialize.toast('Debes indicar un ID v&aacute;lido de 10 caracteres',5000,'rounded');
    }else{
      if(!DBBuscaEncuesta(uq.encu)){
        Materialize.toast('El ID no existe',5000,'rounded');
      }else{
        window.location="#/admin";
      }
    }
  }
  function DBBuscaEncuesta(id_encuesta)
  {
    Materialize.toast(id_encuesta,5000,'rounded');
    return true;
  }
  uq.votarEncuesta=function()
  {
    if(uq.encu=="" || uq.encu.length!=10)
    {
      Materialize.toast('Debes indicar un ID v&aacute;lido de 10 caracteres',5000,'rounded');
    }else{
      if(!DBBuscaEncuesta(uq.encu)){
        Materialize.toast('El ID no existe',5000,'rounded');
      }else{
        window.location="#/votar";
      }
    }
  }
  uq.votar=function()
  {
    window.location="#/";
  }
});
uquest.factory("uquestFactory", function(){
    var preguntas=[];
    var opciones=[];
    var adminencu=[];
    var interfaz = {
        pass:"",
        fecha:"",
        fecha1:"",
        fecha2:"",
        preguntaTemp:"",
        multiple:-1,
        getNumPregunta: function(){
            return preguntas.length+1;
        },
        getPreguntas: function(){
          return preguntas;
        },
        setPreguntas: function(p){
          preguntas=p;
        },
        getOpciones: function()
        {
          return opciones;
        },
        anadirOpcion: function(o)
        {
          for(i=0;i<opciones.length;i++)
          {
            if(o==opciones[i])
            {
              return false;
            }
          }
          opciones.push(o);
          return true;
        },
        borraTodasOpc: function()
        {
          opciones=[];
        },
        borraTodo: function()
        {
          preguntas=[];
          opciones=[];
        },
        borraOpcion: function(num)
        {
          var opcc=[];
          for(i=0;i<opciones.length;i++)
          {
            if(i<num)
            {
              opcc[i]=opciones[i];
            }else if(i>num)
            {
              opcc[i-1]=opciones[i];
            }
          }
          opciones=opcc;
        }
    }
    return interfaz;
});
