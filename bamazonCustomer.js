var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost", 
    port: 8889,
    user: "root", 
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    start();
});

// first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("\nItems for SALE:" + "\nID--Product------------Price-");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | "  + res[i].product_name + " | " + parseInt(res[i].price).toFixed(2)); 
        }
        console.log("--------------------");
    });
}

//The app should then prompt users with two messages.--ask them the ID of the product they would like to buy--how many units of the product they would like to buy.

function wantToBuy() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "userChoice",
                message: "What is the ID of the product you would like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                
            }
        ])
}