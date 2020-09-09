var list = document.getElementById("list");

function addTodo() {
    var todo_item = document.getElementById("todo-item");

    //create li tag with text node
    var li = document.createElement('li');
    var liText = document.createTextNode(todo_item.value);

    li.appendChild(liText);

    //create delete button
    var delBtn = document.createElement("button")
    var delText = document.createTextNode("DELETE")
    delBtn.setAttribute("class", "btn btn-danger")
    delBtn.setAttribute("onclick", "deleteItem(this)")
    delBtn.appendChild(delText)


    //create edit button
    var editBtn = document.createElement("button");
    var editText = document.createTextNode("EDIT");
    editBtn.setAttribute("class", "btn btn-info")
    editBtn.appendChild(editText);
    editBtn.setAttribute("onclick", "editItem(this)");

    li.appendChild(delBtn);
    li.appendChild(editBtn);

    list.appendChild(li);

    var key = firebase.database().ref('StudentData').push().key
    delBtn.setAttribute('value', key)
    editBtn.setAttribute('value', key)

    var studentData = {
        TodoListName: todo_item.value,
        key: key
    }

    firebase.database().ref('StudentData/' + key).set(studentData)


    todo_item.value = ""

}

function deleteItem(e) {
    e.parentNode.remove()
    firebase.database().ref('StudentData/' + e.value).remove()
}

function editItem(e) {
    var val = prompt("Enter Updated Value : ", e.parentNode.firstChild.nodeValue)
    e.parentNode.firstChild.nodeValue = val;

    key = e.value
    var studentData = {
        TodoListName: val,
        key: key
    }
    firebase.database().ref('StudentData/' + key).set(studentData)
}

function deleteAll() {
    list.innerHTML = "";
    firebase.database().ref('StudentData/').remove()

}

function showTodo() {
    firebase.database().ref('StudentData').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            firebase.database().ref('StudentData/' + childKey + '/TodoListName').on('value', function(data) {
                if (data.val() != null) {
                    var todo_item = document.getElementById("todo-item");

                    //create li tag with text node
                    var li = document.createElement('li');
                    var liText = document.createTextNode(data.val());

                    li.appendChild(liText);

                    //create delete button
                    var delBtn = document.createElement("button")
                    var delText = document.createTextNode("DELETE")
                    delBtn.setAttribute("class", "btn btn-danger")
                    delBtn.setAttribute("onclick", "deleteItem(this)")
                    delBtn.appendChild(delText)


                    //create edit button
                    var editBtn = document.createElement("button");
                    var editText = document.createTextNode("EDIT");
                    editBtn.setAttribute("class", "btn btn-info")
                    editBtn.appendChild(editText);
                    editBtn.setAttribute("onclick", "editItem(this)");

                    editBtn.setAttribute('value', childKey)
                    delBtn.setAttribute('value', childKey)

                    li.appendChild(delBtn);
                    li.appendChild(editBtn);

                    list.appendChild(li);
                    todo_item.value = ""
                }
            })
        })
    })

}

showTodo()