var Backbone = require('backbone'),
    Router = require('./router'),
    map = L.mapbox.map('map', 'liedman.map-mmgw7jk5');

new Router({map: map});
Backbone.history.start();
