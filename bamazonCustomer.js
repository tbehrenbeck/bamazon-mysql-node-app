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
        console.log("\nItems for SALE:" + "\nID--Product------------Price-");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + parseInt(res[i].price).toFixed(2));
        }
        console.log("--------------------");
    });
}
wantToBuy();


//The app should then prompt users with two messages
function wantToBuy() {

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name: "input",
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
                if(results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                }
            }
            console.log(chosenItem);
        })
    })
}






//---------

// function wantToBuy() {
//     inquirer
//         .prompt([
//             {
//                 type: "input",
//                 name: "userChoice",
//                 message: "What is the ID of the product you would like to buy?",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             },
//             {
//                 type: "input", 
//                 name: "quantity", 
//                 message: "How many units would you like to buy",
//                 validate: function(value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             }
//         ])
//         .then(function(answer) {
//             var chosenItem; 
//             for (var i = 0; i < answer.length; i++) {
//                 if(answer[i].id === answer.userChoice) {
//                     chosenItem = answer[i];
//                 }
//             }
//             console.log(chosenItem);
//         });
// }