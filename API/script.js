// const domain = 'https://developer.here.com';

// Instanciar um objeto H.Map, especificando:
// • o elemento contêiner do mapa
// • o tipo de mapa a ser usado
// • o nível de zoom no qual exibir o mapa
// • as coordenadas geográficas do ponto no qual centralizar o mapa
// A implementação do código JavaScript mostrado abaixo configura um objeto Map, especificando o tipo de mapa normal,
// o nível de zoom 10 e o centro do mapa como um local perto de Berlim, Alemanha, dados 52,5 de latitude e longitude
// 13,4:

// Cria um objeto Platform (um por aplicativo):
// Initialize the platform object:
var platform = new H.service.Platform({
  'app_id': '{Ck3iVHbjZd1pETqoPFXs}',
  'app_code': '{Lw82eSEqhWwTZDO6BsOTqA}'
});

// Obtain the default map types from the platform object
var maptypes = platform.createDefaultLayers();

// // Instanciar o mapa usando o mapa normal como camada base:
// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  maptypes.normal.map,
  {
    zoom: 10,
    center: {
      lng: 13.4,
      lat: 52.51
    }
  });

// Obter um objeto contendo as camadas de mapa padrão:
var defaultLayers = platform.createDefaultLayers();
// Instanciar o mapa usando o mapa normal como camada base:
// var map = new H.Map(document.getElementById('mapContainer',
// 	defaultLayers.normal.map);
// Altere a camada base do mapa para o mapa de satélite com informações de trânsito:
map.setBaseLayer(defaultLayers.satellite.traffic);

// Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);
// Add event listener:
map.addEventListener('tap', function(evt) {
  // Log 'tap' and 'mouse' events:
  console.log(evt.type, evt.currentPointer.type);
});
// Instantiate the default behavior, providing the mapEvents object:
var behavior = new H.mapevents.Behavior(mapEvents);
