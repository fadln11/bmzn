// ----------
// Load packages
const mysql = require("mysql");
const inquirer = require("inquirer");


// ----------
// Vars
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "monty",
  password: "password",
  database: "bamazonDB"
});
const divider = "\n------------------------------------------------------------\n";


// ----------
// Main Workflow
connection.connect(function(err) {
  if (err) throw err;
  customerFlow();
});


// All Logic Functions

function customerFlow() {
  // show all items
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log(
      'Hi, welcome to Bamazon. Below are the available items, take you pick!\n');
    // Loop through and show all results
    for (var x = 0; x < res.length; x++) {
      // showData is a string containing the show data we will print to the console
      var showData = [
        `Item Id : ${res[x].item_id}  `,
        `Product Name : ${res[x].product_name}  `,
        `Price : ${res[x].price}`
      ].join(', ');
      //  Print info to terminal
      console.log(showData);
    }
    // get item quantity
    getitemQty();
  })
};



function getitemQty() {
  // show all items before prompts
  inquirer.prompt([
    { name: "item_id",
      type: "input",
      message: "Enter item id to buy: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        // return false;
        // exit app
        console.log('Oops, item id can only be a number. Please try again.');
        process.exit(1);
      }
    }, {
      name: "item_qty",
      type: "input",
      message: "Enter quantity of item to buy: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        // exit app
        console.log('Oops, item quantity can only be a number. Please try again.');
        return false;
    }}
  ])
  .then(function (answer) {
    // check if store has enough quantity
    var query = `SELECT price, stock_quantity from products WHERE item_id=${answer.item_id}`;
    connection.query(query, function (err, res) {
      var orderQty = answer.item_qty;
      var itemQty = res[0].stock_quantity;
      var itemPrice = res[0].price;

      if (itemQty > orderQty) {
        var newQty = itemQty - orderQty;
        var totalPrice = itemPrice * orderQty;
        orderItem(answer.item_id, newQty, totalPrice);
      } else {
        console.log(divider
          + `Sorry, insufficient quantity... \n`
          + `Please try a different item or quantity`);
        // exit app
        connection.end();
        process.exit(1);
      }
    });
  });
}


function orderItem(item_id, new_qty, total_price) {
  var query = `UPDATE products SET stock_quantity=${new_qty} WHERE item_id=${item_id}`;
  connection.query(query, function (err, res) {
    console.log(divider
      + 'Thank you for purchasing! \n'
      + `Total purchase: $ ${total_price}`);
    });
  connection.end();
}
