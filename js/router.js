var Backbone = require('backbone'),
    Models = require('./models'),
    Views = require('./views');

module.exports = Backbone.Router.extend({
    initialize: function(options) {
        this._map = options.map;
        this.currentTrack = null;
    },

    routes: {
        ":year-:month-:date-:name": "track"
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

        model.fetch({
            success: function() {
                _this.currentTrack = new Views.Track({model: model, map: map})
                    .render();
            }
        });
    }
});
