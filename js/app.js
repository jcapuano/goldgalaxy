var App = (function() {
    
    // Keep vars & functions private unless there is a reason to use in other 
    // scripts running on the page. For example, to let another script
    // use getCookie(), move it inside the returned object closure.
    
    // Private Vars
    var userIdentity;
    
    var appTitle = document.title;
    var pageData = {};
    
    
    // Private Functions
    
    //--------------------------------------
    //  NAVIGATION
    //--------------------------------------
    
    function changePage(pageID, pageTitle, data) {
        // update page data
        if (!data) {
            pageData = {}
        } else {
            pageData = data;    
        }
        
        // update title
        if (pageTitle) {
            if (appTitle) {
                $.address.title(appTitle+' | '+pageTitle);
            } else {
                $.address.title(pageTitle);
            }
        }
        
        // update page
        $.address.value(pageID);
    }
    
    function updateContent(pageName) {
        
        try {
        	$('#error-display').text("").css('visibility','hidden');
        
	        var pageID = '#'+pageName;
	        
	        // empty content
	        $('#content').empty();
	        
	        if (!pageData) {
	            pageData = {};
	        }
	        
	        // add size name to data for use in templates
	        pageData.size = sizeit.size;
	        
	        // add user name to page data by default
	        pageData.userIdentity = userIdentity;
	        
	        if (!$(pageID+'Template').length) {
	            // if no page template, throw error, go to default page
	            console.error(pageID+'Template not found');
	        }
	        
	        // add the content
	        $(pageID+'Template').tmpl(pageData).appendTo('#content');
	        
	        $("#footer-user").empty();
	        if (userIdentity) {
	        	$('#userTemplate').tmpl(userIdentity).appendTo('#footer-user');
	        }
            
	        // If using jQuery mobile, use page() to refresh styles to the new content,
	        // wrap it in a conditional if mixing mobile and desktop
	        //
	        // if (isMobile) {
	        //    $(pageID).page(); 
	        // }
	        
	        // Scroll to top
	        window.scrollTo(0,0);    
        } catch (ex) {
        	$('#error-display').text(ex).css('visibility','visible');
        }
    }
    
    function setPageEvents() {
        
        // set global events
        $('#wrapper')
            .delegate('#button-signout', 'click', function(e){
                e.preventDefault();
                userIdentity = null;
                setCookie('userToken', '', 0);
                enableSignout(false);
                changePage('logon', 'Welcome');
            });
        
        // set page events
        $('#content')
        
            // WELCOME PAGE
            .delegate('#logon-submit', 'click', function(e){
                e.preventDefault();
                $('#form-logon').submit();
            })
            .delegate('#form-logon', 'submit', function(e){
            	try {
	                e.preventDefault();
	                var userName = $('#logon-username').val();
	                var userPassword = $('#logon-password').val();
	                
	                // check that the user is valid, etc...
	                if (validateUser(userName, userPassword)) {	
	                	userIdentity = logonUser(userName, userPassword);
	                    if (userIdentity && userIdentity.isValid) { 
	                    	$('#error-display').text("").css('visibility','hidden');
                            enableSignout(true);
                            setCookie('userToken', userIdentity.Token);
	                    	handleUserLogon(userIdentity);
	                    } else {
	                    	$('#error-display').text("Authentication for User [" + userName + "]  failed").css('visibility','visible');
	                    }
	                } else {
	                	$('#error-display').text("Invalid Username / Password entered").css('visibility','visible');
	                }
                } catch (ex) {
                	$('#error-display').text(ex).css('visibility','visible');
                }
            })
            
            // DASHBOARD PAGE
    }
    
    function enableSignout(enable) {
        if (enable) {
            $('#button-signout').show();
        } else {
            $('#button-signout').hide();
        }
    }
    
    //--------------------------------------
    //  FORM HANDLING
    //--------------------------------------
    function validateUser(username, password) {
    	if (!username || username.length < 1)
        	return false;
            
    	if (!password || password.length < 1)
        	return false;
            
		return true;
    }
    
    function logonUser(username, password) {
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
    
    function handleUserLogon(data) {
        
        changePage('dashboard','Dashboard',data)
    }
    
    //--------------------------------------
    //  COOKIES
    //--------------------------------------
    
    function getCookie(cookieName) {
        var i, x, y, cookies = document.cookie.split(';');
        var cookieValue = '';
        for (i = 0; i < cookies.length; i++)
        {
            x = cookies[i].substr(0, cookies[i].indexOf('='));
            y = cookies[i].substr(cookies[i].indexOf('=')+1);
            x = x.replace(/^\s+|\s+$/g,'');
            if (x == cookieName) {
                cookieValue = unescape(y);
            }
        }
        return cookieValue;
    }
    
    function setCookie(cookieName, value, expDays) {
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + expDays);
        var cookieValue = escape(value) + ((expDays === null) ? '' : '; expires='+expDate.toUTCString());
        document.cookie = cookieName + '=' + cookieValue;
    }
    
    return {
        
        // create public vars / functions here, inside the closure
        
        init : function() {
            
            // use jQuery address for app navigation
            $.address.init(function(event) {
                var userToken = getCookie('userToken');
                if (userToken) {
                    // if user is signed in go dashboard
                    changePage('dashboard','Dashboard')
                } else {
                    // otherwise, go to logon screen (welcome)
                    enableSignout(false);
                    changePage('logon','Welcome')
                }  
            })
                .change(function(event) {
                    updateContent(event.value.substring(1));
            });
            
            setPageEvents();
        }   
    };

}());

$(document).ready(function(){
    App.init();
});