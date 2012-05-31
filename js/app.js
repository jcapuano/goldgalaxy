var cai = cai || {};  

cai.Application = function() {
    var self = this;
    
    self.appViewModel = null;
    self.logonViewModel = null;
    
    self.init = function() {
    	self.appViewModel = new cai.AppViewModel(null);
        self.appViewModel.init();
        $(document).data("index", self.appViewModel);
        ko.applyBindings(self.appViewModel);
        
    	self.logonViewModel = new cai.LogonViewModel();
        self.logonViewModel.init();
        $(document).data("logon", self.logonViewModel);
    };
    
    self.getUser = function() {
    	return self.appViewModel.getUser();
    }
    
    self.setUser = function(user) {
    	self.appViewModel.setUser(user);
    }
    
    self.changePage = function(pageID, pageTitle, data) {
    	self.appViewModel.changePage(pageID, pageTitle, data);
    }
    
    self.setError = function(e) {
    	self.appViewModel.setError(e);
    }
    
    self.clearError = function() {
    	self.appViewModel.setError('');
    }
};

var app = null;

$(document).ready(function(){
	app = new cai.Application();
	app.init();
});