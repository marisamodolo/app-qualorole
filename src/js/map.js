navigator.geolocation.getCurrentPosition(geoSuccess);

function geoSuccess(position) {
  // Do magic with location
  const lat = position.coords.latitude;
  const long = position.coords.longitude;


  // Instantiate a map and platform object:
  var platform = new H.service.Platform({
    'app_id': 'Ck3iVHbjZd1pETqoPFXs',
    'app_code': 'Lw82eSEqhWwTZDO6BsOTqA'
  });
  // Retrieve the target element for the map:
  var targetElement = document.getElementById('mapContainer');

  // Get the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  // Instantiate the map:
  var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.normal.map,
    {
      zoom: 10,
      center: { lat: 52.51,
lng: 13.4 }
    });

  // Create the parameters for the routing request:
  var routingParameters = {
  // The routing mode:
    'mode': 'fastest;car',
    // The start point of the route:
    'waypoint0': `geo!${lat},${long}`,
    // The end point of the route:
    'waypoint1': `geo!${lat},${long}`,
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    'representation': 'display'
  };

  // Define a callback function to process the routing response:
  var onResult = function(result) {
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
      routeShape.forEach(function(point) {
        var parts = point.split(',');
        linestring.pushLatLngAlt(parts[0], parts[1]);
      });

      // Retrieve the mapped positions of the requested waypoints:
      startPoint = route.waypoint[0].mappedPosition;
      endPoint = route.waypoint[1].mappedPosition;

      // Create a polyline to display the route:
      var routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: 'blue',
lineWidth: 10 }
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
    function(error) {
      alert(error.message);
    });


  console.log(lat, long);
}
