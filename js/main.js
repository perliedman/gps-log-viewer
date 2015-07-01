var Backbone = require('backbone'),
    Router = require('./router'),
    Models = require('./models'),
    Views = require('./views');

L.mapbox.accessToken = 'pk.eyJ1IjoibGllZG1hbiIsImEiOiJreTdqT1lBIn0.9Diw-C3yp0t8nROiiJT7bA';
var map = L.mapbox.map('map');

L.control.layers({
    'Map': L.mapbox.tileLayer('mapbox.outdoors').addTo(map),
    'Aerial': L.mapbox.tileLayer('mapbox.satellite')
},
{}, {
    position: 'bottomleft'
}).addTo(map);

new Router({map: map});
Backbone.history.start();
