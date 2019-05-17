var platform = new H.service.Platform({
    'app_id': '9mYIXNigAMmdcixN6JqR',
    'app_code': 'ONv_pc2orD5izwsYwpJ2Qg',
    useCIT: true,
    useHTTPS: true
  });
  var defaultLayers = platform.createDefaultLayers();
  
  //Step 2: initialize a map - this map is centered over Chicago.
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map,{
    center: {lat:-23.5489, lng:-46.6388},
    zoom: 11
  });
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Obtain an Explore object through which to submit search requests:
var explore = new H.places.Explore(platform.getPlacesService()), exploreResult, error;

// Define search parameters:
var params = {
  // Look for places matching the category "eat and drink":
  'cat': 'bar',
  // Search in the Chinatown district in San Francisco:
  'in': '-23.5489,-46.6388;r=500'
};

// Run a search request with parameters, headers (empty), and callback functions:
explore.request(params, {}, onResult, onError);

// Define a callback function to handle data on success:
function onResult(data) {
  exploreResult = data;
}

// Define a callback function to handle errors:
function onError(data) {
  error = data;
}

// Run a search request with parameters, headers (empty), and callback functions:
explore.request(params, {}, onResult, onError);