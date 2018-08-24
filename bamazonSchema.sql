DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
	id INTEGER NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50), 
	department_name VARCHAR(50),
	price INTEGER(10,2),
	stock_quantity INTEGER(10),
	PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Magnetic Calendar", "Office Products", 9.47, 10),
			("Living Cookbook", "Kitchen Essentials", 7.49, 30), 
			("Darkest Hour Blu-ray", "Entertainment", 9.99, 5), 
			("Bocce Ball Set", "Sports & Outdoors", 24.99, 15), 
			("Aviator Sunglasses", "Clothing", 130.85, 14), 
			("LED Camping Lantern", "Sports & Outdoors", 11.51, 22), 
			("Purell Wipes", "Health & Household", 11.50, 28), 
			("Princess Castle Play Tent", "Toys & Games", 17.99, 4), 
			("Fire TV Cube", "Electronics", 89.99, 48),
			("Stainless Steel Blade", "Sports & Outdoors", 45.67, 7)

SELECT * FROM products;