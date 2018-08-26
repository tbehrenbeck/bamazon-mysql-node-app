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
    start();
});

// first display all of the items available for sale
function start() {
    connection.query('SELECT id, product_name, department_name, price FROM products', function (err, res) {
        if (err) throw err;
        var productsTable = new Table({
          head: ['ID', 'Name', 'Department', 'Price'],
          colWidths: [5, 33, 25, 15]
        });
        for (var i = 0; i < res.length; i++) {
          productsTable.push([res[i].id, res[i].product_name, res[i].department_name, "$"+res[i].price]);
        };
        console.log(productsTable.toString());
      });
      wantToBuy();
}

//The app should then prompt users with two messages
function wantToBuy() {

    connection.query("SELECT * FROM products", function (err, res) {
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
            for (var i = 0; i < res.length; i++) {
                if(res[i].id == answer.choice) {
                    chosenItem = res[i];
                }
            }
            var updateStock = chosenItem.stock_quantity - parseInt(answer.quantity);
            var totalPurchase = chosenItem.price * parseInt(answer.quantity);
            var productSalesTotals= chosenItem.product_sales + totalPurchase;

            if(parseInt(updateStock) < 0) {
                console.log("Insufficient quantity!")
                start();
            } 
            else {
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
                    function(err) {
                        if(err) throw err;
                        console.log("\nPurchase successful! Your total is $" + totalPurchase.toFixed(2));

                        //update product_sales column
                        connection.query(
                            "UPDATE products SET ? WHERE ?", 
                            [
                                {
                                    product_sales: productSalesTotals
                                }, 
                                {
                                    id: chosenItem.id
                                } 
                            ],
                            function(err) {
                                if(err) throw err;
                            },
                        );
                        start()
                    }
                )
            }
        })
    })
}
