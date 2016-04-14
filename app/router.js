import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.resource('publications', function() {
    this.route('new');
    this.route('fileimport');
    this.route('import');
    this.route('show', {path: 'show/:id'}, function() {
      this.route('edit');
    });
    this.route('create');
    this.route('dashboard', function() {
      this.route('start');
      this.route('drafts');
      this.route("published");
      this.route("touched");
      this.route('review');
      this.route('biblreview');
      this.route('admin');
    });
  });
  this.resource('admin', function() {
    this.route('departments', function(){
      this.route('index', {path: '/'});
      this.route('new');
    });
    this.route('people');
    this.route('person', function() {
      this.route('edit', {path: 'edit/:id'});
    });
  });
});

export default Router;

