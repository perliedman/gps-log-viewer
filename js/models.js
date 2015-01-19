var Backbone = require('backbone'),
    trackModel = Backbone.Model.extend({
        defaults: {
            duration: 0,
            distance: 0,
            time: []
        },
        url: function() {
            return 'data/tracks/' + this.id + '.json';
        },
        parse: function(response) {
            if (response.time) {
                response.time = response.time.map(function(unixTs) { return new Date(unixTs * 1000); });
            }
            return response;
        },
        hasTime: function() {
            var t = this.attributes.time;
            return t && t.length >= 2;
        }
    }),
    indexModel = Backbone.Collection.extend({
        url: function() {
            return 'data/tracks/index.json';
        },
        model: trackModel
    }),
    statsModel = Backbone.Model.extend({
        defaults: {
            'time': 0,
            'distance': 0
        },
        addTrack: function(t) {
            this.set('time', this.get('time') + t.get('duration'));
            this.set('distance', this.get('distance') + t.get('distance'));
        }
    }),
    timeAggregationModel = Backbone.Model.extend({
        defaults: {
            'tracks': []
        },
        initialize: function() {
            this._aggregate();
        },
        getYears: function() {
            var years = this.get('years');
            return Object.keys(years).
                filter(function(k) { return parseInt(k, 10) > 0;});
        },
        getMonths: function(year) {
            var months = this.get('years')[year];
            return Object.keys(months).
                filter(function(k) { return parseInt(k, 10) >= 0;});
        },
        _aggregate: function() {
            var yearModels = this.get('tracks').reduce(function(years, t) {
                var trackTime = t.get('time');
                if (!trackTime || trackTime.length < 1) {
                    return years;
                }

                var y = trackTime[0].getFullYear(),
                    m = trackTime[0].getMonth(),
                    yearModel = years[y],
                    monthModel;
                if (!yearModel) {
                    years[y] = yearModel = {stats: new statsModel()};
                }
                monthModel = yearModel[m];
                if (!monthModel) {
                    yearModel[m] = monthModel = {stats: new statsModel()};
                }

                monthModel.stats.addTrack(t);
                yearModel.stats.addTrack(t);
                years.stats.addTrack(t);
                monthModel[trackTime[0].getDate()] = t;

                return years;
            }, {
                stats: new statsModel()
            });

            this.set('years', yearModels);
        }
    });

module.exports = {
    Track: trackModel,
    TrackIndex: indexModel,
    TrackAggregation: timeAggregationModel
};
