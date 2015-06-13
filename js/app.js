/**
 * Create an array of interesting places that we will turn in to Google map markers
 * @type {*[]}
 */
var places = [];

var InterestingPlace = function(title, category, googleMap, lat, lon) {
    this.title = title;
    this.category = category;
    this.googleMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: googleMap,
        title: title
    });
    this.infoWindow = new google.maps.InfoWindow({
        content: title
    });
    google.maps.event.addListener(this.googleMarker, 'click', function() {
        var self = this;
        self.infoWindow.open(googleMap, self.googleMarker)
    }.bind(this));
};

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
    places.push(new InterestingPlace('Work', 'work', map, 38.9587, -104.7919));
    places.push(new InterestingPlace('Nice Park', 'fun', map, 38.9568, -104.7878));
    places.push(new InterestingPlace('Post Office', 'work', map, 38.9598, -104.7878));
    places.push(new InterestingPlace('Bird Dog BBQ', 'food', map, 38.9627, -104.7960));
    places.push(new InterestingPlace('Panera', 'food', map, 38.9626, -104.7945));

    // Automatically center the map fitting all places on the screen
    var bounds = new google.maps.LatLngBounds();
    var markersLength = places.length;
    for (var i = 0; i < markersLength; i++) {
        bounds.extend(places[i].googleMarker.getPosition());
    }
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

    self.vmMarkers = ko.observableArray(places);
    self.filterString = ko.observable("");
    self.filterPlaces = ko.computed(function () {
        var markersLength = self.vmMarkers().length;
        console.log('markersLenth: ' + markersLength + ', filterString: ' + self.filterString());
    });
    self.visiblePlaces = ko.computed(function () {
        var placesLength = places.length;
        var returnArray = [];
        for (var i = 0; i < placesLength; i++) {
            var checkString = places[i].title.toLowerCase() + ' ' + places[i].category.toLowerCase();
            if (checkString.indexOf(self.filterString().toLowerCase()) !== -1) {
                returnArray.push(places[i]);
            }
        }
        return returnArray;
    });
};

