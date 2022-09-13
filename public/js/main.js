const deleteBtn = document.querySelectorAll('.fa-trash') // select all trashcan icons

const item = document.querySelectorAll('.item span') //select all span items
const itemCompleted = document.querySelectorAll('.item span.completed') //select all completed span items


//adds event listeners to delete trashcan buttons  and calls function deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)   
})

//adds event listeners to items and calls function markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// adds event listener to completed elements and calls function markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})



async function deleteItem(){ // declare async function
    const itemText = this.parentNode.childNodes[1].innerText  //looks inside of the list item and grabs only the inner text withing the list

    try{ //starting a try block

        const response = await fetch('deleteItem', { // creates a var that waits on a fetch to get data from  the result of delete item 
            method: 'delete', //sets the crud method for the route
            headers: {'Content-Type': 'application/json'},  //specifying the type of content expected as json
            body: JSON.stringify({ //turning the message of body from request into a string
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and namint it "itemFromJs"
            })
          })

        const data = await response.json() //waiting for server to respond with some json
        console.log(data)
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //catch block in case if there is an error and try fails 
        console.log(err)
    }
}

async function markComplete(){  // declare async function

    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text withing the list
    try{  //starting a try block
        const response = await fetch('markComplete', { // creates a var that waits on a fetch to get data from  the result of markComplete 
            method: 'put', // setting the crud method to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected as json
            body: JSON.stringify({ //turning the message of body from request into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item and namint it "itemFromJs"
            })
          })
        const data = await response.json()  //waiting for server to respond with some json
        console.log(data)
        location.reload() //reloads the page to update what is displayed

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){ // declare async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text withing the list
    try{ //starting a try block
        const response = await fetch('markUnComplete', { // creates a var that waits on a fetch to get data from  the result of markComplete 
            method: 'put', // setting the crud method to update for the route
            headers: {'Content-Type': 'application/json'},  //specifying the type of content expected as json
            body: JSON.stringify({ //turning the message of body from request into a string
                'itemFromJS': itemText  // setting the content of the body to the inner text of the list item and namint it "itemFromJs"
            })
          })
        const data = await response.json() //waiting for server to respond with some json
        console.log(data)
        location.reload() //reloads the page to update what is displayed

    }catch(err){
        console.log(err)
    }
}