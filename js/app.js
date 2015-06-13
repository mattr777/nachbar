/**
 * Created by Matt on 6/11/2015.
 */
function initialize() {
    /**
     * Create the map
     */
    var mapOptions = {
        center: new google.maps.LatLng(38.9597, -104.7915),
        zoom: 17
        // TODO: set zoom level based on window size viewport
        // TODO: weather api
        // TODO: open street maps, bing, etc.
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    /**
     * Create an array of interesting places
     * @type {*[]}
     */
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
            title: 'Bird Dog BBQ'
        },
        {
            position: new google.maps.LatLng(38.9626, -104.7945),
            map: map,
            title: 'Panera'
        }];

    /**
     * Create and bind the ViewModel for knockout
     * @constructor
     */
    var ViewModel = function () {
        this.markers = ko.observableArray(markers);
    };
    ko.applyBindings(new ViewModel());

    var bounds = new google.maps.LatLngBounds();
    var markersLength = markers.length;
    for (var i = 0; i < markersLength; i++) {
        bounds.extend(markers[i].position);
        var marker = new google.maps.Marker(markers[i]);
    }
    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
}
google.maps.event.addDomListener(window, 'load', initialize);
