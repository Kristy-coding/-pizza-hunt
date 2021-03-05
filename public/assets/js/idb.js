//add this script to add-pizza.html
//Now that the page for adding a pizza includes the idb.js file, let's establish a connection to IndexedDB. In idb.js, add the following code

//Here, we create a variable db that will store the connected database object when the connection is complete. After that, we create the request variable to act as an event listener for the database. That event listener is created when we open the connection to the database using the indexedDB.open() method.

//As part of the browser's window object, indexedDB is a global variable. Thus, we could say window.indexedDB, but there's no need to. The .open() method we use here takes the following two parameters:

//The name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist). We'll use the name pizza_hunt.

//The version of the database. By default, we start it at 1. This parameter is used to determine whether the database's structure has changed between connections. Think of it as if you were changing the columns of a SQL database.

// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// THE REQUEST VARIABLE ACTS AS AN EVENT LISTENER FOR THE DATABASE
const request = indexedDB.open('pizza_hunt', 1);

//Like other database systems, the IndexedDB database itself doesn't hold the data. In SQL, tables hold the data; likewise, in MongoDB, collections hold the data. In IndexedDB, the container that stores the data is called an object store. We can't create an object store until the connection to the database is open, emitting an event that the request variable will be able to capture
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
  };


//Before we move on to actually saving data, let's add a few more event listeners to the request object. Add the following code below the rest of the code in idb.js:
//With this first event handler, onsuccess, we set it up so that when we finalize the connection to the database, we can store the resulting database object to the global variable db we created earlier.
// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
       uploadPizza();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  //-----------------------------------------------------------------------------//
//We've now established a connection to the IndexedDB database and created some structure for storing the data in it. Next we'll set up the functionality for writing data to it.

//With IndexedDB, we don't always have that direct connection like we do with SQL and MongoDB databases, so methods for performing CRUD operations with IndexedDB aren't available at all times. Instead, we have to explicitly open a transaction, or a temporary connection to the database. This will help the IndexedDB database maintain an accurate reading of the data it stores so that data isn't in flux all the time.

//Once we open that transaction, we directly access the new_pizza object store, because this is where we'll be adding data. Finally, we use the object store's .add() method to insert data into the new_pizza object store.

//This saveRecord() function will be used in the add-pizza.js file's form submission function if the fetch() function's .catch() method is executed.

//Create the following function in idb.js after the code you've written so far

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // add record to your store with add method
    pizzaObjectStore.add(record);
  }

//-----------------------------------------------------------------------------//
//Let's add the functionality to send the stored data to the server on network reconnection
//We can now save pizza to IndexedDB as a fallback option in situations of no internet. But, as we mentioned earlier, what good is that unless we upload the pizza when we regain that connection?

//We need to create a function that will handle collecting all of the data from the new_pizza object store in IndexedDB and POST it to the server, so let's do that now.

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
  
    // more to come...
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            //If there's data to send, we send that array of data we just retrieved to the server at the POST /api/pizzas endpoint. Fortunately, the Mongoose .create() method we use to create a pizza can handle either single objects or an array of objects, so no need to create another route and controller method to handle this one event
          fetch('/api/pizzas', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
              //On a successful server interaction, we'll access the object store one more time and empty it, as all of the data that was there is now in the database
              // open one more transaction
              const transaction = db.transaction(['new_pizza'], 'readwrite');
              // access the new_pizza object store
              const pizzaObjectStore = transaction.objectStore('new_pizza');
              // clear all items in your store
              pizzaObjectStore.clear();
    
              alert('All saved pizza has been submitted!');
            })
            .catch(err => {
              console.log(err);
            });
        }
      };
  }



//But what happens if the internet outage is temporary and it comes back one minute after it saves to IndexedDB? What can the user do to trigger this uploadPizza() function?
//Well, they won't have to do anything—instead, we'll add a browser event listener to check for a network status change!
// listen for app coming back online
//Here, we instruct the app to listen for the browser regaining internet connection using the online event. If the browser comes back online, we execute the uploadPizza() function automatically
window.addEventListener('online', uploadPizza);