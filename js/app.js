/**
 * Create an array of interesting places that we will turn in to Google map markers
 * @type {*[]}
 */
var markers = [];

/**
 * Array of Google marker objects
 * @type {Array}
 */
var googleMarkers = [];

function initializeMap() {
    /**
     * Create the map
     */
    var mapOptions = {
        center: new google.maps.LatLng(38.9597, -104.7915),
        zoom: 17
        // TODO: set zoom level based on window size viewport
        // TODO: weather api
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    /**
     *  Add interesting places to our map
     */
    markers.push({
        position: new google.maps.LatLng(38.9587, -104.7919),
        map: map,
        title: 'Work',
        category: 'work'
    });
    markers.push({
        position: new google.maps.LatLng(38.9568, -104.7878),
        map: map,
        title: 'Nice Park',
        category: 'fun'
    });
    markers.push({
        position: new google.maps.LatLng(38.9598, -104.7878),
        map: map,
        title: 'Post Office',
        category: 'work'
    });
    markers.push({
        position: new google.maps.LatLng(38.9627, -104.7960),
        map: map,
        title: 'Bird Dog BBQ',
        category: 'food'
    });
    markers.push({
        position: new google.maps.LatLng(38.9626, -104.7945),
        map: map,
        title: 'Panera',
        category: 'food'
    });

    var bounds = new google.maps.LatLngBounds();
    var markersLength = markers.length;
    for (var i = 0; i < markersLength; i++) {
        bounds.extend(markers[i].position);
        var googleMarker = new google.maps.Marker(markers[i]);
        googleMarkers.push(googleMarker);
    }
    // Automatically center the map fitting all vmMarkers on the screen
    map.fitBounds(bounds);

    // bind our view model to knockout now that everything is created
    ko.applyBindings(new ViewModel());

}
google.maps.event.addDomListener(window, 'load', initializeMap);

/**
 * Create the ViewModel
 * @constructor
 */
var ViewModel = function () {
    var self = this;

    self.vmMarkers = ko.observableArray(markers);
    self.filterString = ko.observable("");
    self.filterPlaces = ko.computed(function () {
        var markersLength = self.vmMarkers().length;
        console.log('markersLenth: ' + markersLength + ', filterString: ' + self.filterString());
        //for (var i = 0; i < markersLength; i++) {
        //    if (this.vmMarkers()[i].title === searchString) {
        //        googleMarkers[i].setVisible(true);
        //    } else {
        //        googleMarkers[i].visible(false);
        //    }
        //}
    });
    self.visiblePlaces = ko.computed(function () {
        var markersLength = markers.length;
        var returnArray = [];
        for (var i = 0; i < markersLength; i++) {
            var checkString = markers[i].title.toLowerCase() + ' ' + markers[i].category.toLowerCase();
            if (checkString.indexOf(self.filterString().toLowerCase()) !== -1) {
                returnArray.push(markers[i]);
            }
        }
        return returnArray;
    });
};

