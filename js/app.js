/**
 * Create an array of interesting places that will contain Google map markers
 * @type {*[]}
 */
var places = [];

/**
 * Components of NY Times article search API used to retrieve news about places
 * @type {string}
 */
var nyTimesURL1 = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq="';
var nyTimesURL2 = '"&sort=newest&api-key=ddbcaf1b7406d615b0a8ce133bd34ceb:19:72240625&fl=web_url,headline';

/**
 * Constructor for the main object in our system.  This represents an interesting place
 * with all of the information about the place and the relevant Google Maps objects to represent it.
 * @param title Name of the interesting place.
 * @param category Category of the place, currently food, fun, or work, but any other string can be used/
 * @param googleMap The Google Map object we want to show up in.
 * @param lat Latitude for marker on map.
 * @param lon Longitude for marker on map.
 * @constructor
 */
var InterestingPlace = function (title, category, googleMap, lat, lon) {
    // title and category used to describe place
    this.title = title;
    this.category = category;

    // google.maps.Marker object that is used to place us on the map
    this.googleMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: googleMap,
        title: title
    });

    // google.maps.InfoWindow that is used to display information about the place
    this.infoWindow = new google.maps.InfoWindow({
        content: title
    });

    // function to display information when a user clicks us in the list view
    this.openInfoWindow = function () {
        closeInfoWindows();
        this.infoWindow.open(googleMap, this.googleMarker);
    };

    // register for clicks on the marker object and display information when clicked
    google.maps.event.addListener(this.googleMarker, 'click', function () {
        var self = this;
        closeInfoWindows();
        self.infoWindow.open(googleMap, self.googleMarker);
    }.bind(this));

    // asynchronously load content about the place in the info window when available
    // only show one story to reduce clutter
    $.getJSON(nyTimesURL1 + this.title + nyTimesURL2, function (data) {
        var self = this;
        var articles = data.response.docs;
        if (articles.length > 0) {
            var article = articles[0];
            self.infoWindow.setContent('<a href="' + article.web_url + '">' + article.headline.main + '</a>');
        } else {
            self.infoWindow.setContent('<p>No related stories in NY Times currently.</p>');
        }
    }.bind(this)).error(function () {
        var self = this;
        self.infoWindow.setContent('<p>Unable to retrieve NY Times content.</p>');
    }.bind(this));
};

/**
 * Create the Google Map object, add interesting places to map, adjust the map to display all the places,
 * and bind our viewmodel for Knockout.
 */
function initializeMap() {
    // Create the map
    var mapOptions = {
        center: new google.maps.LatLng(38.9597, -104.7915),
        zoom: 17
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Add interesting places to our map
    places.push(new InterestingPlace('Fluke Networks', 'work', map, 38.9587, -104.7919));
    places.push(new InterestingPlace('Nice Park', 'fun', map, 38.9568, -104.7878));
    places.push(new InterestingPlace('US Post Office', 'work', map, 38.9598, -104.7878));
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

    // the string we are currently using to filter results
    self.filterString = ko.observable("");

    // array of places that should be visible according to filter string
    // also set visibility of google markers
    self.visiblePlaces = ko.computed(function () {
        var placesLength = places.length;
        var returnArray = [];
        for (var i = 0; i < placesLength; i++) {
            var checkString = places[i].title.toLowerCase() + ' ' + places[i].category.toLowerCase();
            if (checkString.indexOf(self.filterString().toLowerCase()) !== -1) {
                places[i].googleMarker.setVisible(true);
                returnArray.push(places[i]);
            } else {
                places[i].googleMarker.setVisible(false);
                places[i].infoWindow.close();
            }
        }
        return returnArray;
    });
};

/**
 * Utility function to close all infoWindows
 */
var closeInfoWindows = function() {
    var placesLength = places.length;
    for (var i = 0; i < placesLength; i++) {
        places[i].infoWindow.close();
    }
};
