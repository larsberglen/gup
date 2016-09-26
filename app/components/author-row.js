import Ember from 'ember';

export default Ember.Component.extend({
  errors: null,
  didInsertElement: function() {
  },
  /*
  resetForm: function() {
    if (this.get("item.newAuthorForm")) {
      if(!this.get('item.importedAuthorName')) {
        this.set("item.newAuthorForm.firstName", '');
        this.set("item.newAuthorForm.lastName", '');
      }
      this.set("item.newAuthorForm.year_of_birth", '');
      this.set("item.newAuthorForm.xaccount", '');
      this.set("item.newAuthorForm.orcid", '');
    }
  },
  */
  // Used to signal select2-adjusted component to set a default query string
  setDefaultQuery: Ember.computed('item.importedAuthorName', function() {
    return !!this.get('item.importedAuthorName');
  }),

  showInputFields: Ember.computed('item.importedAuthorName', 'addAffiliation', function(){
    return (!!this.get('item.importedAuthorName') && this.get('addAffiliation')) || !this.get('item.importedAuthorName');
  }),

  isImportedExternal: Ember.computed('item.importedAuthorName', 'addAffiliation', function(){
    return !!this.get('item.importedAuthorName') && !this.get('addAffiliation');
  }),
  /*
  newAuthorFormVisible: function() {
    var self = this;
    if (this.get('item.transformedToNewAuthor')) {
      this.resetForm();
      Ember.run.later(function() {
        self.$().find('#first-name').focus();
      });
    }
  }.observes('item.transformedToNewAuthor'),
  */

  actions: {
    setMsgHeader: function(type, msg) {
      this.sendAction('setMsgHeader', type, msg);
    },
    queryAuthors: function(query, deferred) {
      deferred.reject = function(reason) {
        console.log(reason);
      };
      var success = function(data) {
        data = data.map(function(item){
          // Create presentation string
          var nameStr = [item.first_name, item.last_name].compact().join(' ');
          var yearStr = [item.year_of_birth].compact().join('');
          var idStr = [item.xaccount, item.orcid].compact().join(', ')

            if(yearStr) {
              yearStr = ', ' + yearStr
            }
          if(idStr) {
            idStr = ' ' + ['(', idStr, ')'].join('')
          }
          item.presentation_string = nameStr + yearStr + idStr;
          return item;
        });
        return deferred.resolve(data);
      };

      var fromStore = this.store.find("person_record", {search_term: query.term});
      fromStore.then(success, deferred.reject);

    },

    moveUpOne: function(id) {
      this.sendAction('moveUp', id);
    },

    moveDownOne: function(id) {
      this.sendAction('moveDown', id);
    },

    remove: function(id) {
      this.sendAction('removeAuthor', id);
    },

    toggleAddAffiliation: function(){
      var that = this;
      this.toggleProperty('addAffiliation');
      Ember.run.later(function(){
        var obj = that.$('.'+ that.get('item.id')).first();
        console.log('obj', obj);
        obj.select2('open');
      });
    },
    toggleAddNewAuthor: function(item) {
      if (item.get("transformedToNewAuthor") === true) {
        item.set("transformedToNewAuthor", false);
      }
      else {
        item.set("transformedToNewAuthor", true);
      }

    },
    createAuthor: function(item) {
      var that = this;
      var successHandler = function(model) {
        item.set('selectedAuthor', model);
        item.set('transformedToNewAuthor', false);
      };
      var errorHandler = function(reason) {
        that.send('setMsgHeader', 'error', reason.error.msg);
        that.set('errors', reason.error.errors);
        Ember.run.later(function() {
          Ember.$('[data-toggle="popover"]').popover({
            placement: 'top',
            html: true
          });
        });
      };
      //console.log(newAuthor.get('firstName'));
      this.store.save('person',{'first_name': item.newAuthorForm.get('firstName'), 'last_name': item.newAuthorForm.get('lastName'), 'year_of_birth': item.newAuthorForm.get('year_of_birth'),
        'xaccount': item.newAuthorForm.get('xaccount'), 'orcid': item.newAuthorForm.get('orcid') }).then(successHandler, errorHandler);
    },
    addInstitution: function(institution){
      // Add institution to selected array
      var institutionObject = Ember.Object.create(institution);
      this.get('item.selectedInstitution').addObject(institutionObject);
      // Add institution to select2 component
      var id = '#s2id_' + this.get('item.id');
      var institutionsElement = Ember.$(id).select2('data');
      institutionsElement.addObject(institutionObject);
      Ember.$(id).select2('data', institutionsElement);
    }
  }
});
