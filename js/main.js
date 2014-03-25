var Backbone = require('backbone'),
    Router = require('./router'),
    Models = require('./models'),
    Views = require('./views'),
    map = L.mapbox.map('map');

L.control.layers({
    'Map': L.mapbox.tileLayer('liedman.hj92n687').addTo(map),
    'Aerial': L.mapbox.tileLayer('liedman.hj933401')
},
{}, {
    position: 'bottomleft'
}).addTo(map);

new Router({map: map});
Backbone.history.start();
