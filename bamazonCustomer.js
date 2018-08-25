var mysql = require("mysql");
var inquirer = require("inquirer");

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
    start();
});

// first display all of the items available for sale
function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log(
            "\nItem id " + " Product         " + " Price"+ 
            "\n------- " + " --------------- " + " ------" );
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id +"     " +  " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("--------------------");
        wantToBuy();
    });
}



//The app should then prompt users with two messages
function wantToBuy() {

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name: "choice",
                type: "input",
                message: "What is the ID of the product you would like to buy?", 
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
                message: "How many units would you like to buy",
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
            for (var i = 0; i < results.length; i++) {
                if(results[i].id == answer.choice) {
                    chosenItem = results[i];
                }
            }
            // console.log(answer.quantity);
            if(chosenItem.stock_quantity <= 0) {
                console.log("Insufficient quantity!")
            } else {
                var updateStock = chosenItem.stock_quantity - answer.quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?", 
                    [
                        {
                            stock_quantity: updateStock
                        }, 
                        {
                            id: chosenItem.id
                        }
                    ], 
                    function(error) {
                        if(error) throw error;
                        console.log("purchase successful");
                    }
                )
            }
        })
    })
}
