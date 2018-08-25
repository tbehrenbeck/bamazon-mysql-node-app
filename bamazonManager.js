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

//start up menu 
function menu() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            switch (answer.menu) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLow();
                    break;
            }
        })
}

//display all products
function viewProducts() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        
        var productsTable = new Table({
            head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
            colWidths: [4, 30, 25, 10, 10]
        });
        for (var i = 0; i < res.length; i++) {
            productsTable.push([res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
        };
        console.log(productsTable.toString());
        menu();
    });
};

//display all products with less than 5 stock quantity
function viewLow() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            //console.log(res[i].stock_quantity < 5);
            if (res[i].stock_quantity < 5) {
                var productsTable = new Table({
                    head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
                    colWidths: [4, 30, 25, 10, 10]
                });
                productsTable.push([res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);

                console.log(productsTable.toString());
                
            };
        };
        menu();
    });
};
