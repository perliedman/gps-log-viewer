var Backbone = require('backbone'),
    Router = require('./router'),
    Models = require('./models'),
    Views = require('./views'),
    map = L.mapbox.map('map', 'liedman.hj92n687');

new Models.TrackIndex().fetch({success: function(model) {
    var trackAgg = new Models.TrackAggregation({tracks: model});
    new Views.Index({model: trackAgg}).render();
}});
new Router({map: map});
Backbone.history.start();
