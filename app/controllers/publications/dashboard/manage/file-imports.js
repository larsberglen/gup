import Ember from 'ember';


export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  importDataBaseUrl: null,
  uploadImportDataFile: null,
  importDataFile: null,
  uploadSubmitButtonIsVisible: true,
  uploadCancelButtonStyle: 'default',
  uploadCancelButtonLabel: null,
  uploadSubmitButtonIsDisabled: true,
  uploadFileUploadIsVisible: true,
  init() {
    this._super(...arguments);
    this.set('importDataBaseUrl', Ember.getOwner(this).resolveRegistration('config:environment').APP.serviceURL + '/end_note_files');
    this.set('uploadCancelButtonLabel', this.get('i18n').t('publications.dashboard.manage.fileImports.uploadCancelLabel'));
  },
  actions: {
    didUploadImportDataFile: function(response) {
      if('import_data' in response) {
        this.set('importData', response.asset_data);
      }
    },
    importDataFileDidChange: function(file) {
      this.set('uploadSubmitButtonIsDisabled', false);
      this.set('importDataFile', file);
    },
    importDataFileUploadDidErr: function(errorResponse) {
      this.send('resetFileImportUploadState');
    },
    didSaveImportData: function(success, error) {
      this.set('uploadSubmitButtonIsVisible', false);
      this.get('uploadImportDataFile')(this.get('importDataFile')).then((response) => {
        this.set('uploadSubmitButtonIsVisible', false);
        this.set('uploadCancelButtonStyle', 'success');
        //this.send('refreshModel');
        //console.log('success!');
        //success();
      }, (message) => {
        this.set('uploadSubmitButtonIsVisible', false);
        this.set('uploadCancelButtonStyle', 'danger');
        error(message);
      }).finally(() => {
        this.set('uploadFileUploadIsVisible', false);
        this.set('uploadCancelButtonLabel', this.get('i18n').t('publications.dashboard.manage.fileImports.uploadCloseLabel'));
      });
    },
    didCancelImportData: function() {
      this.send('resetFileImportUploadState');
    },
    didDeleteFileImport: function(fileImport) {
      return Promise.resolve();
    },
    resetFileImportUploadState: function() {
      this.set('importData', null);
      this.set('importDataFile', null);
      this.set('uploadSubmitButtonIsVisible', true);
      this.set('uploadCancelButtonLabel', this.get('i18n').t('publications.dashboard.manage.fileImports.uploadCancelLabel'));
      this.set('uploadCancelButtonStyle', 'default');
      this.set('uploadSubmitButtonIsDisabled', true);
      this.set('uploadFileUploadIsVisible', true);
    }
  }
});
