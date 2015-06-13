/**
 * Created by Matt on 6/11/2015.
 */
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(38.9597, -104.7915),
        zoom: 17
        // TODO: set zoom level based on window size viewport
        // TODO: weather api
        // TODO: open street maps, bing, etc.
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var markers = [{
        position: new google.maps.LatLng(38.9587, -104.7919),
        map: map,
        title: 'Work'
    },
        {
            position: new google.maps.LatLng(38.9568, -104.7878),
            map: map,
            title: 'Nice Park'
        },
        {
            position: new google.maps.LatLng(38.9598, -104.7878),
            map: map,
            title: 'Post Office'
        },
        {
            position: new google.maps.LatLng(38.9627, -104.7960),
            map: map,
            title: 'Good Food'
        }];

    var bounds = new google.maps.LatLngBounds();
    var markersLength = markers.length;
    for (var i = 0; i < markersLength; i++) {
        console.log(markers[i].position);
        bounds.extend(markers[i].position);
        var marker = new google.maps.Marker(markers[i]);
    }
    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
}
google.maps.event.addDomListener(window, 'load', initialize);
