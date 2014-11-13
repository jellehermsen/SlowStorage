/**
 * SlowStorage
 *
 * Example usage:
 * var slowStorage = new SlowStorage();
 * slowStorage.setItem('name',lipsum,function(){
 *    slowStorage.getItem('name',function(result){alert(result)});
 * });
 *
 * @constructor
 */
var SlowStorage = function() {
    this.path = null;
    this.fileSystem = null;
};

/**
 * Initializes the SlowStorage paths etc.
 */
SlowStorage.prototype.init = function(callback) {
    var that = this;
    if (navigator.userAgent.indexOf("Android") > 0) {
        this.path = cordova.file.externalApplicationStorageDirectory;
    } else {
        this.path = cordova.file.dataDirectory; 
    }
    this.path = this.path.replace('file://','');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        that.fileSystem = fileSystem;
        callback();
    });
};

/**
 * Returns internal file path
 * @return {string} the path
 */
SlowStorage.prototype.getPath = function() {
    return this.path;
};

/**
 * Gets an item from storage by name
 * @param {string} name The name used for storing. Might not reflect the 
 *                      actual filename that is used.
 * @param {function} is called with either the result {string} or FALSE
 */
SlowStorage.prototype.getItem = function(name, callback) {
    this.fileSystem.root.getFile(this.path + this.hash(name), {create: false, exclusive: false}, function(entry){
        var reader = new FileReader();
        entry.file(function(file){
            reader.onloadend = function(e) {
                callback(e.target.result);
            }
            var fileAsText = reader.readAsText(file);
        });
    },
    function(){callback(false)});
};

/**
 * Removes an item from storage by name
 * @param {string} name The name used for storing. Might not reflect the 
 *                      actual filename that is used.
 * @param {function} callback called with a boolean argument
 */

SlowStorage.prototype.removeItem = function(name, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(result){};
    this.fileSystem.root.getFile(this.path + this.hash(name), {create: false, exclusive: false}, function(entry){
        entry.remove(function(){callback(true)}, function(){callback(false)});
    }, 
    function(){callback(false)});
};

/**
 * Sets an item in the storage
 * @param {string} name The item name
 * @param {string} value The item value
 * @param {function} callback called with a boolean argument
 */
SlowStorage.prototype.setItem = function(name, value, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(result){};
    this.fileSystem.root.getFile(this.path + this.hash(name), {create: true, exclusive: false}, function(entry){
        entry.setMetadata(function(){console.log("Cloud backup DISABLED")}, null, { "com.apple.MobileBackup": 1});
        entry.createWriter(function(writer){
            writer.write(value);         
            callback(true);
        }, 
        function(){callback(false);})
    },
    function(){callback(false);});
};

/**
 * Simple hashing function
 */
SlowStorage.prototype.hash = function(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
};

/**
 * Download given file into the SlowStorage
 * @param {string} name
 * @param {string} url
 * @param {function} callback
 */
SlowStorage.prototype.download = function(name, url, callback){
    var fileTransfer = new FileTransfer();
    fileTransfer.download(
        url,
        this.path + this.hash(name),
        function(theFile) { callback(true); },
        function(error) { callback(false); }
    );
};
