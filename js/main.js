var Backbone = require('backbone'),
    Router = require('./router'),
    Models = require('./models'),
    map = L.mapbox.map('map', 'liedman.map-mmgw7jk5');

new Router({map: map});
Backbone.history.start();

new Models.TrackIndex().fetch({success: function(model) {
    var trackAgg = new Models.TrackAggregation({tracks: model});
}});