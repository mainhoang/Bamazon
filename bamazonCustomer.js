var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("console.table");
// var questions = [
// 	{
//     	type: 'input',
//     	name: 'buy',
//     	message: 'What would you like to buy, today?'

// 	}, 
// 	{
//     	type: 'input',
//     	name: 'quantity',
//     	message: 'How many?'

// 	}
// ];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});
var query = "SELECT product, price, inventory FROM store WHERE ?";


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId);
});

function updateInventory(Q, buyQ, item){
	var newQ = Q - buyQ;
	connection.query("UPDATE store SET inventory=? where product=?", [newQ, item]);
}

// function showBalance(price, buyQ){
// 	con
// 	// connection.query("SELECT price, FROM store WHERE ?", [item], function(err, response){
// 	// 	for (var i = 0; i < response.length; i++) {
//  //                // console.log(quantity);
//  //            console.log("You owe " + response[i].price );
                
//  //        }
// 	// })
// }

connection.query("SELECT * FROM store", function(err, response) {
    console.table(response);
    inquirer.prompt([{
        type: 'input',
        name: 'buy',
        message: 'What would you like to buy, today?',
    }, {
        type: 'input',
        name: 'quantity',
        message: 'How many?',
    }]).then(function(answer) {

        console.log("================================================================================");
        console.log("It looks like you would like to buy " + answer.quantity + " " + answer.buy + "s. Let me check to see if we can fulfill your order.");
        console.log("================================================================================");

        var item = answer.buy;
        var quantity = answer.quantity;

        connection.query(query, { product: item }, function(err, response) {

            for (var i = 0; i < response.length; i++) {
                // console.log(quantity);
                console.log(response[i]);
                if (response[i].inventory >= quantity) {

                    console.log("We have enough!");
                    updateInventory(response[i].inventory, quantity, item);
                    console.log("You owe " + response[i].inventory * quantity);

                } else {

                    console.log("Insufficient quantities!");

                }
            }
        })

    });
});
