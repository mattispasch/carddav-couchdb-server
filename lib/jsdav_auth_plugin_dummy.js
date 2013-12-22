var jsDAV_Auth_Backend_AbstractBasic = require("jsDAV/lib/DAV/plugins/auth/abstractBasic");

/**
 * Just accepts any basic user/pw 
 */
var jsDAV_Auth_Backend_Dummy = module.exports = jsDAV_Auth_Backend_AbstractBasic.extend({
	initialize : function() {
	},

	 validateUserPass: function(username, password, cbvalidpass) {
		 cbvalidpass(true);
	 },

});