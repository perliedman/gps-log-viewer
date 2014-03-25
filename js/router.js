var Backbone = require('backbone'),
    $ = require('jquery-untouched'),
    Models = require('./models'),
    Views = require('./views');

module.exports = Backbone.Router.extend({
    initialize: function(options) {
        this._map = options.map;
        this.currentTrack = null;
    },

    routes: {
        '': 'index',
        'all-tracks': 'allTracks',
        ':year-:month-:date-:name': 'track'
    },

    index: function() {
        new Models.TrackIndex().fetch({success: function(model) {
            var trackAgg = new Models.TrackAggregation({tracks: model});
            new Views.Index({model: trackAgg}).render();
        }});
    },

    allTracks: function() {
        new Models.TrackIndex().fetch({success: function(model) {
            var $index = $('#index'),
                subview;
            model.header = 'All Tracks';
            subview = new Views.TrackList({model: model}).render();

            $index.html('');
            $index.append(subview.el);
        }});
    },

    track: function(year, month, date, name) {
        var model = new Models.Track({
                id: year + '-' + month + '-' + date + '-' + name
            }),
            map = this._map,
            _this = this;
        if (this.currentTrack) {
            this.currentTrack.remove();
        }

        $('#index .expanded').removeClass('expanded');
        $('#index .selected').removeClass('selected');
        model.fetch({
            success: function() {
                $('#index li[data-track="' + model.id + '"]').addClass('selected');
                $('#index li[data-track="' + model.id + '"] .details').addClass('expanded');
                _this.currentTrack = new Views.Track({model: model, map: map})
                    .render();
            }
        });
    }
});
