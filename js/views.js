var Backbone = require('backbone'),
    $ = require('jquery-untouched');

Backbone.$ = $;

function _i(i) { return document.getElementById(i); }

module.exports = {
    Track: Backbone.View.extend({
        initialize: function(options) {
            this.gpxUrl = 'data/tracks/' + this.model.id + '.gpx';
            this.map = options.map;
        },

        render: function() {
            var map = this.map;

            this.layer = new L.GPX(this.gpxUrl, {
                async: true,
                marker_options: {
                    startIconUrl: 'lib/leaflet-gpx/pin-icon-start.png',
                    endIconUrl: 'lib/leaflet-gpx/pin-icon-end.png',
                    shadowUrl: 'lib/leaflet-gpx/pin-shadow.png'
                }
            }).on('loaded', function(e) {
                var gpx = e.target;
                map.fitBounds(gpx.getBounds());
                _i('dist').textContent = (gpx.get_distance() / 1000).toFixed(2)
                _i('time').textContent = gpx.get_duration_string(gpx.get_total_time(), true)
                _i('pace').textContent = gpx.get_duration_string(gpx.get_total_time() / (gpx.get_distance() / 1000), true)
            }).addTo(map);

            return this;
        },

        remove: function() {
            if (this.layer) {
                this.map.removeLayer(this.layer);
            }

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    })
}