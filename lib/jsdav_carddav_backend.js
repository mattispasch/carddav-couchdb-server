
var jsCardDAV_iBackend = require("jsDAV/lib/CardDAV/interfaces/iBackend");
var jsCardDAV_Plugin = require("jsDAV/lib/CardDAV/plugin");
var jsCardDAV_Property_SupportedAddressData = require("jsDAV/lib/CardDAV/property/supportedAddressData");

var request = require("request");
var json2vcardConverter = require("json-to-vcard/lib/json2vcard");

function log(s) {
	console.log("[my CardDAV Backend] " + s);
}

var jsCardDAV_Backend_CouchDB = module.exports = jsCardDAV_iBackend.extend({
 
	contactsView: null,
	dbUrl:null,
	
    initialize: function(dbUrl) {
    	this.dbUrl = dbUrl;
    	this.contactsView = dbUrl + "_design/Contacts/_view/all";
    },

    /**
	 * Returns the list of addressbooks for a specific user.
	 * 
	 * @param {String}
	 *            principalUri
	 * @return array
	 */
    getAddressBooksForUser: function(principalUri, callback) {
    	log("getAddressBooksForUser called: " + principalUri);
    	
    	request(this.dbUrl, function(err, res, body) {
    		if(err) {
    			callback(err);
    		} else {
    			var json = JSON.parse(body);
		    	var ctag = "UpdateSeq" + json.update_seq;
		    	var books = [];
		    	books.push({
		             id: "1234",
		             uri: "admin",
		             principaluri: "principals/admin",
		             "{DAV:}displayname": "CouchDB Adressbuch",
		             "{http://calendarserver.org/ns/}getctag": ctag,
		             "{urn:ietf:params:xml:ns:carddav}addressbook-description": "mein erstes adressbuch...",
		             "{urn:ietf:params:xml:ns:carddav}supported-address-data": jsCardDAV_Property_SupportedAddressData.new()
		        });
		    	callback(null, books);
    		}
    	});
    },

    /**
	 * Updates an addressbook's properties
	 * 
	 * See jsDAV_iProperties for a description of the mutations array, as well
	 * as the return value.
	 * 
	 * @param {mixed}
	 *            addressBookId
	 * @param {Array}
	 *            mutations
	 * @see jsDAV_iProperties#updateProperties
	 * @return bool|array
	 */
    updateAddressBook: function(addressBookId, mutations, callback) {
    	log("updateAddressBook called, not implemented yet.");
    },

    /**
	 * Creates a new address book
	 * 
	 * @param {String}
	 *            principalUri
	 * @param {String}
	 *            url Just the 'basename' of the url.
	 * @param {Array}
	 *            properties
	 * @return void
	 */
    createAddressBook: function(principalUri, url, properties, callback) {
    	log("createAddressBook called, not implemented yet.");
    },

    /**
	 * Deletes an entire addressbook and all its contents
	 * 
	 * @param {Number}
	 *            addressBookId
	 * @return void
	 */
    deleteAddressBook: function(addressBookId, callback) {
    	log("deleteAddressBook called, not implemented yet.");
    },

    /**
	 * Returns all cards for a specific addressbook id.
	 * 
	 * This method should return the following properties for each card: *
	 * carddata - raw vcard data * uri - Some unique url * lastmodified - A unix
	 * timestamp
	 * 
	 * It's recommended to also return the following properties: * etag - A
	 * unique etag. This must change every time the card changes. * size - The
	 * size of the card in bytes.
	 * 
	 * If these last two properties are provided, less time will be spent
	 * calculating them. If they are specified, you can also ommit carddata.
	 * This may speed up certain requests, especially with large cards.
	 * 
	 * @param {mixed}
	 *            addressbookId
	 * @return array
	 */
    getCards: function(addressbookId, callback) {
    	log("getCards called: " + addressbookId);
    	
    	 var now = Date.now();
    	
    	request(this.contactsView, function(err, res, body){
    		if(err) {
    			callback(err);
    		}
    		var json = JSON.parse(body);
    		
    		var cards = [];
    		
    		for(var i=0; i < json.rows.length; i++)  {
    			var row = json.rows[i];
    			
    			cards.push({
    				 uri: row.id,
                     lastmodified: now,
                     etag: row.value.rev,
    			});
    		}
    		
    		callback(null, cards);
    	});    	
    },

    /**
	 * Returns a specfic card.
	 * 
	 * The same set of properties must be returned as with getCards. The only
	 * exception is that 'carddata' is absolutely required.
	 * 
	 * @param {mixed}
	 *            addressBookId
	 * @param {String}
	 *            cardUri
	 * @return array
	 */
    getCard: function(addressBookId, cardUri, callback) {
    	log("getCard called, addressBook: " + addressBookId + ", cardUri: " + cardUri);
    	
    	var now = Date.now();
    	request(this.dbUrl + cardUri, function(err, res, body) {
    		if(err) {
    			callback(err);
    		}
    		var doc = JSON.parse(body);
    		
    		var card = {
				uri: doc._id,
                carddata: json2vcardConverter.json2vcard(doc),
                lastmodified: now,
                etag: doc._rev,
            };
    		
    		callback(null, card);
    	});
    },

    /**
	 * Creates a new card.
	 * 
	 * The addressbook id will be passed as the first argument. This is the same
	 * id as it is returned from the getAddressbooksForUser method.
	 * 
	 * The cardUri is a base uri, and doesn't include the full path. The
	 * cardData argument is the vcard body, and is passed as a string.
	 * 
	 * It is possible to return an ETag from this method. This ETag is for the
	 * newly created resource, and must be enclosed with double quotes (that is,
	 * the string itself must contain the double quotes).
	 * 
	 * You should only return the ETag if you store the carddata as-is. If a
	 * subsequent GET request on the same card does not have the same body,
	 * byte-by-byte and you did return an ETag here, clients tend to get
	 * confused.
	 * 
	 * If you don't return an ETag, you can just return null.
	 * 
	 * @param {mixed}
	 *            addressBookId
	 * @param {String}
	 *            cardUri
	 * @param {String}
	 *            cardData
	 * @return string|null
	 */
    createCard: function(addressBookId, cardUri, cardData, callback) {
    	log("createCard called, not implemented yet.");
    },

    /**
	 * Updates a card.
	 * 
	 * The addressbook id will be passed as the first argument. This is the same
	 * id as it is returned from the getAddressbooksForUser method.
	 * 
	 * The cardUri is a base uri, and doesn't include the full path. The
	 * cardData argument is the vcard body, and is passed as a string.
	 * 
	 * It is possible to return an ETag from this method. This ETag should match
	 * that of the updated resource, and must be enclosed with double quotes
	 * (that is: the string itself must contain the actual quotes).
	 * 
	 * You should only return the ETag if you store the carddata as-is. If a
	 * subsequent GET request on the same card does not have the same body,
	 * byte-by-byte and you did return an ETag here, clients tend to get
	 * confused.
	 * 
	 * If you don't return an ETag, you can just return null.
	 * 
	 * @param {mixed}
	 *            addressBookId
	 * @param {String}
	 *            cardUri
	 * @param {String}
	 *            cardData
	 * @return string|null
	 */
    updateCard: function(addressBookId, cardUri, cardData, callback) {
    	log("updateCard called, not implemented yet.");
    },

    /**
	 * Deletes a card
	 * 
	 * @param {mixed}
	 *            addressBookId
	 * @param {String}
	 *            cardUri
	 * @return bool
	 */
    deleteCard: function (addressBookId, cardUri, callback) {
    	log("deleteCard called, not implemented yet.");
    }
});