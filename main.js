/* Svetaines logika */
/*jshint esversion: 6 */
const monthNames = ["Jan", "Febr", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

window.onload = function() {
    if(sessionStorage.getItem('todo') != null) {
        show('todo','todoList');
    }
    if(sessionStorage.getItem('done') != null) {
        show('done','doneList');
    }
};

// Adds task to todo list
function add() {
    var itemDate = setTaskDate();
    var itemText = document.getElementById("input").value;
    var itemId = getID();
    // To check if input is empty
    if(itemText === "" || !itemText.replace(/\s/g, '').length) {
        alert("Nepalikti tuščio lauko.");
        return;
    }
    var item = {id: itemId, date: itemDate, text: itemText};
    document.getElementById("input").value = "";            // Clean input field
    putToStorage(item,'todo');
    show('todo','todoList');
}

// Sets date for when the task is added
function setTaskDate() {
    var date = new Date();
    var mmm = monthNames[date.getMonth()];
    var dd = date.getDate();
    var yyyy = date.getFullYear();

    return mmm +' '+ dd +' '+ yyyy;
}

// Uses seesion to retrive task's id
function getID() {
    var id = 0;
    if(sessionStorage.getItem('todo') != null) {
        id = JSON.parse(sessionStorage.getItem('todo')).length;
    }
    return id;
}

// Puts item to specified storage
// itemToPut - item we are putting in stroage
// storage - storage name
function putToStorage(itemToPut, storage) {
    var list = [];
    // Checks if seesion storage is empty
    if(sessionStorage.getItem(storage) != null) {
        list = JSON.parse(sessionStorage.getItem(storage));
    }
    list.push(itemToPut);
    sessionStorage.setItem(storage, JSON.stringify(list));
}

// Removes task from the todo list
// id - task's id
function remove(id){
    var list = JSON.parse(sessionStorage.getItem('todo'));
    for(var i=0; i < list.length; i++){
        if(list[i].id == id) {
            putToStorage(list[i],'done');
            list.splice(i,1);
        }
    }
    sessionStorage.setItem('todo', JSON.stringify(list));
    show('todo','todoList');
    show('done','doneList');
}

// Displays given list into given element
// storage - storage (list) name
// divId - id of div in which we show given list 
function show(storage, divId) {
    var list = JSON.parse(sessionStorage.getItem(storage));        
    var div = (storage === 'todo') ? getToDo(list) : getDone(list);
    document.getElementById(divId).innerHTML = div;
    completeRate();
}

// Returns todo list in html form
// list - list to convert into html form
function getToDo(list) {
    var html = '<ul>';
    for(var i = 0; i < list.length; i++) {
        var text = list[i].text;
        var id = list[i].id;
        var date = list[i].date;
        var labelDate = '<label class="itemLabelDate">' + date + '</label><br>';
        var labelText = '<label class="itemLabelText">' + text + '</label>';
        html += '<div class="itemToDo" onClick="remove(id)" id="'+ id +'">' + labelDate + labelText +'</div>';
    }
    html += '</ul>';
    return html;
}

// Returns done list in html form
// list - list to convert into html form
function getDone(list) {
    var html = '<ul>';
    for(var i = 0; i < list.length; i++) {
        var text = list[i].text;
        var id = list[i].id;
        html += '<li class="done">' + text + '</li>';
    }
    html += '</ul>';

    return html;
}

// Shows completion rate
function completeRate() {
    var todoList = JSON.parse(sessionStorage.getItem('todo'));
    var doneList = JSON.parse(sessionStorage.getItem('done'));
    var allDone = (doneList === null) ? todoList.length : (todoList.length + doneList.length);
    document.getElementById("task").innerHTML = "- " + todoList.length +"/"+ allDone + " ("+percentage(todoList.length, allDone)+"%)";
    document.getElementById("over").innerHTML = "- " + doneList.length +"/"+ allDone + " ("+percentage(doneList.length, allDone)+"%)";
}

// Returns percentage
function percentage(partialValue, totalValue) {
    var num = (100 * partialValue) / totalValue;
    return num.toFixed(2);
} 