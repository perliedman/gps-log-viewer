var Backbone = require('backbone'),
    $ = require('jquery-untouched'),
    _ = require('underscore'),
    Handlebars = require('hbsfy/runtime'),
    moment = require('moment'),
    templates = require('./templates');

Backbone.$ = $;

function _i(i) { return document.getElementById(i); }

function pad(d) {
    return (d < 9 ? '0':'') + parseInt(d, 10);
}

Handlebars.registerHelper('date', function(s) {
    return moment(s).format('YYYY-MM-DD');
});

Handlebars.registerHelper('distance', function(s, d) {
    return (s / 1000).toFixed(d);
});

Handlebars.registerHelper('time', function(t) {
    if (!t || t.length < 2) {
        return '-';
    }

    var d = Math.floor((t[1].getTime() - t[0].getTime()) / 1000),
        h = Math.floor(d / 3600),
        m = Math.floor((d % 3600) / 60),
        s = d % 60,
        result = pad(m) + ':' + pad(s);

    if (h) {
        result = h + ':' + result;
    }
    return result;
});

Handlebars.registerHelper('pace', function(t) {
    if (!t.time || t.time.length < 2 || t.distance <= 0) {
        return '-';
    }
    var pace = Math.floor((t.time[1].getTime() - t.time[0].getTime()) / 1000) / (t.distance / 1000) / 60;
    return Math.floor(pace) + '\'' + (pad((pace - Math.floor(pace)) * 60)) + '\'\' / km';
});

module.exports = {
    Index: Backbone.View.extend({
        initialize: function(options) {
            this.map = options.map;
        },

        render: function() {
            var model = {
                tracks: this.model.get('tracks').models.
                    map(function(t, i) {
                        return _.extend({
                            date: t.attributes.time[0],
                            url: '#' + (t.attributes.time.length > 0 ? moment(t.attributes.time[0]).format('YYYY-MM-DD') + '-' +
                                                                                    t.attributes.name : '')
                        }, t.attributes);
                    }).
                    sort(function(a, b) { return b.date - a.date; })
                };
            $('#index').html(templates.index(model));
        }
    }),

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