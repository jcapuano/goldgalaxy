var cai = cai || {};  

cai.LogonViewModel = function() {
	var self = this;
    
    self.userName = ko.observable("");
    self.userPassword = ko.observable("");
    
	self.init = function() {
    }    
    
    //--------------------------------------
    //  EVENT HANDLERS
    //--------------------------------------
    
    self.logon = function(e) {
    	try {
            // check that the user is valid, etc...
            if (self.validateUser(self.userName(), self.userPassword())) {	
            	var user = self.logonUser(self.userName(), self.userPassword());
                if (user && user.isValid) { 
			    	app.clearError();
			        app.setUser(user);
                    //self.userName("");
                    self.userPassword("");
			        app.changePage('dashboard','Dashboard');
                } else {
                	app.setError("Authentication for User [" + self.userName() + "]  failed");
                }
            } else {
            	app.setError("Invalid Username / Password entered");
            }
        } catch (ex) {
        	app.setError(ex);
        }
    }
    
    //--------------------------------------
    //  PRIVATE
    //--------------------------------------
    
    self.validateUser = function(username, password) {
    	if (!username || username.length < 1)
        	return false;
            
    	if (!password || password.length < 1)
        	return false;
            
		return true;
    }
    
    self.logonUser = function(username, password) {
    	// call hub to authenticate user
        // hub.authenticateUser(username, password);
        
		if (password != 'mudbatch')
        	return null;
        
        var roles = [];
        roles.push(new cai.UserRole("admin"));
        roles.push(new cai.UserRole("planner"));
        roles.push(new cai.UserRole("operator"));
        
        return new cai.UserIdentity(username, username+"+"+password, roles);
    }
};

