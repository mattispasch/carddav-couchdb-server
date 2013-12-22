var jsDAV = require("jsDAV/lib/jsdav");
jsDAV.debugMode = true;
var jsDAV_Auth_Backend = require("./lib/jsdav_auth_plugin_dummy");
var jsDAVACL_PrincipalBackend = require("./lib/jsdav_acl_principal_backend");
var jsCardDAV_Backend = require("./lib/jsdav_carddav_backend");
// node classes:
var jsDAVACL_PrincipalCollection = require("jsDAV/lib/DAVACL/principalCollection");
var jsCardDAV_AddressBookRoot = require("jsDAV/lib/CardDAV/addressBookRoot");
// plugins:
var jsDAV_Auth_Plugin = require("jsDAV/lib/DAV/plugins/auth");
var jsDAV_Browser_Plugin = require("jsDAV/lib/DAV/plugins/browser");
var jsCardDAV_Plugin = require("jsDAV/lib/CardDAV/plugin");
var jsDAVACL_Plugin = require("jsDAV/lib/DAVACL/plugin");

var authBackend = jsDAV_Auth_Backend.new();
var principalBackend = jsDAVACL_PrincipalBackend.new();
var carddavBackend = jsCardDAV_Backend.new("http://localhost:5984/contacts/");

// Setting up the directory tree
var nodes = [
    jsDAVACL_PrincipalCollection.new(principalBackend),
    jsCardDAV_AddressBookRoot.new(principalBackend, carddavBackend)
];

jsDAV.createServer({
    node: nodes,
    baseUri: null,
    authBackend: authBackend,
    realm: "jsDAV",
    plugins: [jsDAV_Auth_Plugin, jsDAV_Browser_Plugin, jsCardDAV_Plugin, jsDAVACL_Plugin]
}, 8000);

