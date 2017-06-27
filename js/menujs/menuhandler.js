define(['ojs/ojcore', 'ojs/ojmodel'], function (oj) {
    var Menu = {
        menuUrl: 'http://localhost:3000/applObject',    
        
        createModel: function () {
            var Model = oj.Model.extend({
                urlRoot: this.menuUrl,
                idAttribute: "id"
            });
            return new Model();
        },
        createModelCollection: function () {
            var Models = oj.Collection.extend({
                url: this.menuUrl,
                model: this.createModel()
            });
            return new Models();
        }
    };
    
    return Menu;
});