# Bamazon
Bamazon is a command-line storefront utilizing MySQL. The app will take in orders from customers and deplete stock from the store's inventory. 


## About
In the customer view you are able to view products for sale and then select what you would like to purchase. If the quantity you have selected exceeds what the store stock holds, you will be prompted. In the manager view you are able to view the products for sale and which items are low on stock inventory. You are able to add new stock to these items as well as create a new product for customers to purchase. 

To engage the customer interface:
```
node bamazonCustomer.js
```
To engage the manager interface:
```
node bamazonManager.js
```

### Customer demo:
<p align='center'>
<img width='600' src='https://cdn.rawgit.com/tbehrenbeck/bamazon-mysql-node-app/9437a9bb/images/customer.svg'>
</p>

### Manager demo:
<p align='center'>
<img width='600' src='https://cdn.rawgit.com/tbehrenbeck/bamazon-mysql-node-app/37aa9fb5/images/manager.svg'>
</p>

## Libraries used:
- Chalk
- MySQL
- Inquirer
- CLI-Table
