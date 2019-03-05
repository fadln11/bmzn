DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("item_1", "dept_1", 30, 100),
("item_2", "dept_1", 40, 100),
("item_3", "dept_2", 60, 100),
("item_4", "dept_2", 70, 100),
("item_5", "dept_2", 80, 100),
("item_6", "dept_3", 120, 100),
("item_7", "dept_3", 130, 100),
("item_8", "dept_3", 140, 100),
("item_9", "dept_3", 150, 100),
("item_10", "dept_4", 200, 100);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES
-- ("vanilla", 2.50, 100),
-- ("chocolate", 3.10, 120),
-- ("strawberry", 3.25, 75);