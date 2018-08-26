var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    menu();
});

//Start up menu
function menu() {
    inquirer
        .prompt([
            {
                name: "menu", 
                type: "list", 
                message: "What would you like to do?", 
                choices: ["View Product Sales by Department", "Create New Department", "Exit"]
            }
        ])
        .then(function(answer) {
            switch(answer.menu) {
                case "View Product Sales by Department":
                    departmentOverView();
                    break;
                case "Create New Department":
                    newDept();
                    break;
                case "Exit":
                    process.exit();
                    break;

            }
        })
}

//View product sales by dept
function departmentOverView() {
    connection.query("SELECT * FROM departments", function(err, res) {
        if(err) throw err;

        var departmentTable = new Table({
            head: ["ID", "Department Name", "Over Head Cost"],
            colWidths: [4, 30, 20]
        });
        for (var i = 0; i < res.length; i++) {
            departmentTable.push([res[i].department_id, res[i].department_name, "$"+res[i].over_head_costs]);
        };
        console.log(departmentTable.toString());
        menu();
    });
}

//Create new dept
function newDept() {
    inquirer
    .prompt ([
        {
            name: "name", 
            type: "input", 
            message: "What is the name of the department?"
        }, 
        {
            name: "overHead", 
            type: "input", 
            message: "What is the over head cost of the department?", 
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        connection.query("INSERT INTO departments SET ?", 
        {
            department_name: answer.name, 
            over_head_costs: answer.overHead
        },
         function(err) {
            if(err) throw err;
            console.log("dept added");
            menu();
        })
    })
}