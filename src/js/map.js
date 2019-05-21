window.onload = function() {
  let startPos;
  let geoSuccess = function(position) {
    startPos = position;
    const lat = startPos.coords.latitude;
    const lng = startPos.coords.longitude;
    console.log(lat, lng);
  };
  navigator.geolocation.getCurrentPosition(geoSuccess);
};

  var platform = new H.service.Platform({
    'app_id': 'Ck3iVHbjZd1pETqoPFXs',
    'app_code': 'Lw82eSEqhWwTZDO6BsOTqA',
    useCIT: true,
    useHTTPS: true
  });

  var defaultLayers = platform.createDefaultLayers();

  var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.normal.map,
    {
      center: {
        lat: -23.5489,
        lng: -46.6388
      },
      zoom: 11
    })

  // var targetElement = document.getElementById('mapContainer');

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  var ui = H.ui.UI.createDefault(map, defaultLayers, 'pt-BR');

  var routingParameters = {
    'mode': 'fastest;car',
    'waypoint0': `geo!${lat},${lng}`,//esta linha dá erro falando que lat não está definida
    'waypoint1': `geo!${lat},${lng}`,
    'representation': 'display'
  };

  // Define a callback function to process the routing response:
  var onResult = function (result) {
    var route,
      routeShape,
      startPoint,
      endPoint,
      linestring;
    if (result.response.route) {
      // Pick the first route from the response:
      route = result.response.route[0];
      // Pick the route's shape:
      routeShape = route.shape;

      // Create a linestring to use as a point source for the route line
      linestring = new H.geo.LineString();

      // Push all the points in the shape into the linestring:
      routeShape.forEach(function (point) {
        var parts = point.split(',');
        linestring.pushLatLngAlt(parts[0], parts[1]);
      });

      // Retrieve the mapped positions of the requested waypoints:
      startPoint = route.waypoint[0].mappedPosition;
      endPoint = route.waypoint[1].mappedPosition;

      // Create a polyline to display the route:
      var routeLine = new H.map.Polyline(linestring, {
        style: {
          strokeColor: 'blue',
          lineWidth: 10
        }
      });

      // Create a marker for the start point:
      var startMarker = new H.map.Marker({
        lat: startPoint.latitude,
        lng: startPoint.longitude
      });

      // Create a marker for the end point:
      var endMarker = new H.map.Marker({
        lat: endPoint.latitude,
        lng: endPoint.longitude
      });

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine, startMarker, endMarker]);

      // Set the map's viewport to make the whole route visible:
      map.setViewBounds(routeLine.getBounds());
    }
  };

  // Get an instance of the routing service:
  var router = platform.getRoutingService();

  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function (error) {
      alert(error.message);
    });