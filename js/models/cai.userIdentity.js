var cai = cai || {};  

cai.UserIdentity = function(username, token, roles) {
	this.Username = username;
    this.Token = token;
    this.Roles = roles;
    
    this.isValid = function() {
    	return (Token != null && Token.length > 0);
    }
};

cai.UserRole = function(name) {
	this.Name = name;
};