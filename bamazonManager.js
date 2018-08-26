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
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
            }
        ])
        .then(function (answer) {
            switch (answer.menu) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLow();
                    break;
                case "Add to Inventory":
                    addStock();
                    break;
                case "Add New Product":
                    newProduct();
                    break;
                case "Exit":
                    process.exit();
                    break;
            }
        })
}

//Display all products
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

//Display products with low inventory
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
            }; //TO DO, else statement if no item is < 5 (outside of loop(?))
        };
        menu();
    });
};

//Increase stock quanity of item currently in the store 
function addStock() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What is the ID of the item you would like to add to?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to add?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].id == answer.id) {
                        chosenItem = res[i];
                    }
                }
                var updatedStock = chosenItem.stock_quantity + parseInt(answer.quantity);

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updatedStock
                        },
                        {
                            id: answer.id
                        }
                    ], function (err) {
                            if (err) throw err;
                        })
                console.log("Inventory added successfully"); //TO DO- currently able to "add" a negative number
                menu();
            });
    });
}

//Add new product to store
function newProduct() {
    inquirer
    .prompt([
        {
            name: "item", 
            type: "input", 
            message: "What is the name of the product you would like to add?"
        }, 
        {
            name: "department", 
            type: "list", 
            message: "What department does this product fall under?",
            choices: ["Office Products", "Kitchen Essentials", "Entertainment", "Sports & Outdoors", "Clothing", "Health & Household", "Toys & Games", "Electronics", "Misc"]
        }, 
        {
            name: "price", 
            type: "input", 
            message: "How much does it cost?", 
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, 
        {
            name: "quantity", 
            type: "input",
            message: "How many would you like to stock?", 
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        connection.query("INSERT INTO products SET ?", 
        {
            product_name: answer.item,
            department_name: answer.department,
            price: answer.price, 
            stock_quantity: answer.quantity
        },
         function (err) {
            if(err) throw err;
            console.log("New product added successfully");
            menu();
        })
    })
}


