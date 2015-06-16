import Ember from 'ember';

export default Ember.Component.extend({

  isApproved: false,

  diffCategories: Ember.computed('item.category_objects', function() {

    var oldCategories = this.get('item.diff_since_review.category_hsv_local.from') || [];
    var newCategories = this.get('item.category_objects');

    var a = [];

    newCategories.forEach(function(cat) {

      if (!oldCategories.findBy('svepid', cat.svepid)) {
        cat.added = true;
      } else {
        cat.same = true;
      }

      a.push(cat);

    });

    oldCategories.forEach(function(cat) {

      if (!newCategories.findBy('svepid', cat.svepid)) {
        cat.removed = true;
        a.push(cat);
      }

    });

    return a;

  }),

  diffDepartments: Ember.computed('item.affiliation', function() {

    var oldDepartments = this.get('item.diff_since_review.affiliation.from') || [];
    var newDepartments = this.get('item.affiliation.departments');

    var a = [];

    newDepartments.forEach(function(dep) {

      if (!oldDepartments.findBy('id', dep.id)) {
        dep.added = true;
      } else {
        dep.same = true;
      }

      a.push(dep);

    });

    oldDepartments.forEach(function(dep) {

      if (!newDepartments.findBy('id', dep.id)) {
        dep.removed = true;
        a.push(dep);
      }

    });

    return a;

  }),

  actions: {

    approve: function(item) {

      Ember.$("body").addClass("loading");
      var that = this;

      this.store.find('review', item.db_id).then(
        function(response) {

          that.sendAction('setMsgHeader', 'success', 'Posten har godkänts.');
          Ember.$("body").removeClass("loading");
          that.set('isApproved', true);

        },
        function(reason) {

          that.sendAction('setMsgHeader', 'error', 'Posten kunde inte godkännas.');
          Ember.$("body").removeClass("loading");

      });     

    }
  }


});