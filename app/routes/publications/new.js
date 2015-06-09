import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {


  model: function() {

    return Ember.RSVP.hash({dataSources: this.store.find("data_source")});

  },

  setupController: function(controller, model) {

    controller.set('selectedSource', null);
    controller.set('sourceId', null);
    controller.set('importData', null);
    controller.set('error', null);

    var dataSources = model.dataSources.map(function(source) {
      return {value: source.code, label: source.label};
    });
    controller.set('dataSources', dataSources);

  }

});
