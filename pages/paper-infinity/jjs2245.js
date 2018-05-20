/**
Julian Silerio
jjs2245
UI Homework 4
3/7/2018
**/

// employees data
var employees = [
    "Phyllis",
    "Angela",
    "Dwight",
    "Oscar",
    "Creed",
    "Pam",
    "Jim",
    "Stanley",
    "Michael",
    "Kevin"
];

// sales data
var sales = [
    {
        "client": "Shake Shack",
        "reams": 100
    },
    {
        "client": "Toast",
        "reams": 100
    },
    {
        "client": "Computer Science Department",
        "reams": 100
    },
];

// new variable for clients
var clients = [];

// gets clients from sales and adds to clients var
function makeClients(sales) {
    for(x in sales) {
        clients.push(sales[x].client);
    }
}

// inserts a row to the sales table
function addSale(client, reams, table, index=-1) {
    var row = table.insertRow(index);
    var client_cell = row.insertCell(0);
    var reams_cell = row.insertCell(1);
    var delete_cell = row.insertCell(2)
    client_cell.innerHTML = client;
    reams_cell.innerHTML = reams;
    delete_cell.innerHTML = '<input type="button" class ="btn btn-danger" value="X" onclick="deleteSale(this)">';
}

// gets inputs from input field, checks input, adds sale and primes for next one
function addNewSale(row) {
    var client = document.getElementById('clients');
    var reams = document.getElementById('reams');
    var table = row.parentNode.parentNode.parentNode.parentNode;

    if(!client.value) {
        alert("Client cannot be empty");
        client.focus();
        client.select();
    } else if(!reams.value) {
        alert("Reams must be a number and cannot be empty");
        reams.focus();
        reams.select();
    } else {
        // first row: header
        // second row: submit field
        addSale(client.value, reams.value, table, 2);

        client.value = '';
        reams.value = '';

        client.focus();
        client.select();
    }
}

// remove a row from the sales table
function deleteSale(row) {
    var index = row.parentNode.parentNode.rowIndex;
    var table = row.parentNode.parentNode.parentNode.parentNode;
    table.deleteRow(index);
}

// load the sales table from the current data
function loadTable(sales, table) {
    for(x in sales) {
        addSale(sales[x].client,sales[x].reams, table);
    }
}

// add an employee to a given gorup
function addEmployee(employee, group) {
    var row = document.createElement('div');
    row.setAttribute('class', 'row draggable boxed bg-offwhite');
    row.append(employee);
    group.append(row);
}

// load employees to PPC page
function loadEmployees(employees, group) {
    for(x in employees) {
        addEmployee(employees[x], group);
    }
}

// move employee to target group
function moveEmployee(item, target) {
    var employee = item[0];
    employee.setAttribute('style', 'position: relative; cursor: move;');
    target.append(employee);

}

// when the page loads
$(document).ready(function() {

    // set up autocomplete
    makeClients(sales);
    $('#clients').autocomplete({
        source: clients
    });

    // set up sales table
    var table = document.getElementById('sales_table');
    loadTable(sales, table);

    // event listener for enter on submit
    var reams_input = document.getElementById('reams');
    reams_input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("sales_submit").click();
        }
    });

    // load employees
    var init = document.getElementById('non-members');
    loadEmployees(employees,init);

    // set up draggable interface
    $(".draggable").draggable({
        revert: "invalid",
        classes: {
            "ui-draggable-dragging": "cell-yellow top-layer"
        },
        cursor: "move"
    });

    // set up hover interface
    $(".draggable").hover(
        function() {
            $(this).css("cursor", "move");
            $(this).css("background-color", "yellow");
        }, function() {
            $(this).css("background-color", "#f9f9f9");
        }
    );

    // set up droppable interface
    $(".droppable").droppable({
        accept: ".draggable",
        classes: {
            "ui-droppable-hover": "ui-state-hover bg-grey"
        },
        drop: function( event, ui ) {
            moveEmployee(ui.draggable, event.target);
      }
  });

});
