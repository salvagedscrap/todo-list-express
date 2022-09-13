const express = require('express') //using express
const app = express() //setting a var and assinging it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with mongoclient and talk to our db
const PORT = 2121  //localhost port
require('dotenv').config() 


let db, //declare a var called db 
    dbConnectionStr = process.env.DB_STRING, //declaring a var and assigning connection string
    dbName = 'todo' //declaring a var and assigning the name of the database 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a conn to db and passing in the connection string
    .then(client => { // waiting for the conn and proceeding if successful and passing in all the client info
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)

    })
    //middlewares-whatever happens between req and res
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // Parses JSON content from incoming reqs




app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in sets up req and res parameters
    const todoItems = await db.collection('listtodo').find().toArray() // sets a var and awaits res from db
    const itemsLeft = await db.collection('listtodo').countDocuments({completed: false})// sets a var and awaits number of uncompleted items to display on ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // injects items and item numbers on ejs which renders and spits as html

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method 
    db.collection('listtodo').insertOne({thing: request.body.todoItem, completed: false}) //inserts new item into listtodo collection
    .then(result => { //if insert is successfull clg and refresh the page by redirecting it to "/"
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // PUT method when the markcomplete route is passed in
    db.collection('listtodo').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //sets completed value to true
          }
    },{
        sort: {_id: -1}, //moves item at the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was succ
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // PUT method when the markcomplete route is passed in
    db.collection('listtodo').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false  //sets completed value to false
          }
    },{
        sort: {_id: -1}, //moves item at the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was succ
        console.log('Marked Uncomplete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //starts a del method when the delete route is passed 
    db.collection('listtodo').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the one item that has a matching name from our js file
    .then(result => { // starts a then if update was succ
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{  // setting up which port we will be listening on - either the port from the .env file or local PORT value
    console.log(`Server running on port ${PORT}`) // clg the running port
})