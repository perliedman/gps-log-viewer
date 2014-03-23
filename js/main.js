var Backbone = require('backbone'),
    Router = require('./router'),
    Models = require('./models'),
    map = L.mapbox.map('map', 'liedman.hj92n687');

new Router({map: map});
Backbone.history.start();
