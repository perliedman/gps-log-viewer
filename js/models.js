var Backbone = require('backbone');

module.exports = {
    Track: Backbone.Model.extend({
        url: function() {
            return "data/tracks/" + this.id + ".json";
        }
    })
}