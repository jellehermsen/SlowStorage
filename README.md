SlowStorage
===========

SlowStorage is a tiny Javascript library that you can use in conjunction with Apache Cordova. It allows you to use the file system as a fallback storage, when the amount of space you get by using regular HTML5 web storage isn't enough. Function calls are modelled after web storage.

Every value you set is saved as a seperate file. To create a proper file name this library uses a simple hashing function. 

**TODO: Add a removeItem function**

Usage
-----

### Include SlowStorage.js in your html:
    <script scr="SlowStorage.js" type="text/javascript"></script>

### Initialize SlowStorage:
    slowStorage = new SlowStorage();
    slowStorage.init(function(done){
        // At this point slowStorage is initialized if done === true
    });

### Setting an item and using the callback:
    slowStorage.setItem('itemname','itemvalue',function(done){
       console.log('Item successfully set'); 
    });


### Setting an item without callback:
    slowStorage.setItem('itemname','itemvalue');

### Getting an item
    slowStorage.getItem('itemname',function(result){
        if(result === false) return console.log("Could not find item");
        console.log("Result is: " + result);
    });

### Get the internal Slowstorage path
    console.log(slowStorage.getPath());
