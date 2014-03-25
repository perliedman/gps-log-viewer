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

    var d = t && t.length && t.length >= 2 ? Math.floor((t[1].getTime() - t[0].getTime()) / 1000) : t,
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

exports.TrackList = Backbone.View.extend({
    template: templates.trackList,

    initialize: function() {
    },

    render: function() {
        var model = {
            header: this.model.header,
            tracks: this.model.
                map(function(t) {
                    var id = (t.attributes.time.length > 0 ? moment(t.attributes.time[0]).format('YYYY-MM-DD') + '-' +
                                                                                t.attributes.name : '');
                    return _.extend({
                        id: id,
                        date: t.attributes.time[0],
                        url: '#' + id
                    }, t.attributes);
                }).
                sort(function(a, b) { return b.date - a.date; })
        };
        this.$el.html(this.template(model));

        return this;
    }
});

exports.Index = Backbone.View.extend({
    initialize: function() {
        var latestTracks = this.model.
            get('tracks').models.
            filter(function(t) { return t.hasTime(); }).
            sort(function(a, b) { return b.get('time')[0].getTime() - a.get('time')[0].getTime(); }).
            slice(0, 3);
        this._trackList = new exports.TrackList({model: latestTracks});
    },

    render: function() {
        var $el = $('#index'),
            latestYear = Math.max.apply(this, this.model.getYears()),
            latestYearModel = this.model.get('years')[latestYear],
            latestMonth = Math.max.apply(this, this.model.getMonths(latestYear)),
            latestMonthModel = latestYearModel[latestMonth],
            model = {
                latestYear: latestYear,
                latestMonth: moment.months()[latestMonth],
                latestYearStats: latestYearModel.stats.attributes,
                latestMonthStats: latestMonthModel.stats.attributes
            };
        $el.html(templates.index(model));
        this._trackList.render();
        $el.find('.latest-tracks').append(this._trackList.el);

        return this;
    }
});

exports.Track = Backbone.View.extend({
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
        }).addTo(map);

        return this;
    },

    remove: function() {
        if (this.layer) {
            this.map.removeLayer(this.layer);
        }

        Backbone.View.prototype.remove.apply(this, arguments);
    }
});