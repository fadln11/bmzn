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

connection.connect(function (err) {
  if (err) throw err;
  managerFlow();
});


function managerFlow() {
  // ask a set of menu options
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product",
      "exit"
    ]
  }).then(function (answer) {
    switch (answer.action) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add to Inventory":
        addInventory();
        // addInventory_old();
        break;
      case "Add New Product":
        addNewProduct();
        break;
      case "exit":
        connection.end();
        console.log('Exiting app now....');
        break;
    }
  });
}


function viewProducts() {
  // show all items
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log('Hi managers, welcome to Bamazon. These are the available items.');
    showItem(res);
  })
  connection.end();
};


function viewLowInventory() {
  // show all items
  connection.query(
    `SELECT item_id, product_name FROM products WHERE stock_quantity < 5`, function (err, res) {
    if (err) throw err;
    if (res.length > 1) {
      console.log('Hi managers, these are the items with < 5 stock_quantity.');
      showItem(res);
    } else {
      console.log(divider
        + 'There is no item with low inventory now, congrats!');
    }
  });
  connection.end();
};


function addInventory() {
  // prompt user for info
  inquirer.prompt([
    { name: "item_id",
      type: "input",
      message: "Enter item id to add: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log('Oops, item id can only be a number. Please try again.');
        return false;
      }
    }, {
      name: "item_qty",
      type: "input",
      message: "Enter quantity of item to add: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log('Oops, item quantity can only be a number. Please try again.');
        return false;
    }}
  ]).then(function (answer) {
    var query = `SELECT product_name, stock_quantity from products WHERE item_id=${answer.item_id}`;
    connection.query(query, function (err, res) {
      // console.log(res);
      // check if item exists
      if (res.length >= 1) {
        var itemQty = res[0].stock_quantity;
        var newQty = parseInt(itemQty) + parseInt(answer.item_qty);
        console.log(`Adding item...`);
        console.log(`Adding qty ${answer.item_qty} to item id ${answer.item_id}...`);
        updateItem(answer.item_id, answer.item_qty, newQty);
      } else {
        console.log(divider + 'Item does not exist. Please try again.');
        // exit app
        connection.end();
        process.exit(1);
      }
    });
  });
};


function addNewProduct() {
  // prompt user for info
  inquirer.prompt([
    {
      name: "item_name",
      type: "input",
      message: "Enter new item name : ",
    }, {
      name: "dept_name",
      type: "input",
      message: "Enter department name : ",
    }, {
      name: "item_price",
      type: "input",
      message: "Enter new item price : $ ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log('Oops, item price can only be a number. Please try again.');
        return false;
      }
    }, {
      name: "item_qty",
      type: "input",
      message: "Enter quantity of new item: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log('Oops, item id can only be a number. Please try again.');
        return false;
      }
    }
  ]).then(function (answer) {
    // check if item exists
    var query = `SELECT * from products WHERE product_name="${answer.item_name}"`;
    connection.query(query, function (err, res) {
      if (res.length < 1) {
        console.log(`Adding new item...`);
        addItem(answer.item_name, answer.dept_name, answer.item_price, answer.item_qty);
      } else {
        var itemName = res[0].product_name;
        console.log(divider
          + `Hmm... Item name ${itemName} already exists. Please try again.`);
        // exit app
        connection.end();
        process.exit(1);
      }
    });
  });
};


function showItem(res) {
  // Loop through and show all results
  for (var x = 0; x < res.length; x++) {
    // showData is a string containing the show data we will print to the console
    var showData = [
      `Item Id: ${res[x].item_id}`,
      `Product Name:  ${res[x].product_name}`,
      `Price: ${res[x].price}`,
      `Quantity: ${res[x].stock_quantity}`
    ].join(', ');
    //  Print info to terminal
    console.log(showData);
  }
};


function updateItem(item_id, item_qty, new_qty) {
  var query = `UPDATE products SET stock_quantity=${new_qty} WHERE item_id=${item_id}`;
  connection.query(query, function (err, res) {
    console.log(divider
      + `Adding qty ${item_qty} to item id ${item_id}.`
      + `Item added! \n`
      + `New item id ${item_id} quantity: ${new_qty}.`);
  });
  connection.end();
};


function addItem(item_name, dept_name, item_price, item_qty) {
  var query = `INSERT into products (product_name, department_name, price, stock_quantity)
    VALUES ("${item_name}", "${dept_name}", ${item_price}, ${item_qty})`;
  connection.query(query, function (err, res) {
    console.log(divider
      + `Adding new product: `
      + `${item_name} of qty ${item_qty} `
      + `in department ${dept_name} and price ${item_price}.\n`
      + `Item added! \n`);
  });
  connection.end();
};
