# PHP & MySQL (MariaDB) Server Template

This template allows you to run a PHP server and a MySQL (MariaDB) database on Replit. 
It is pre-configured to connect to a database using the secrets feature on Replit.

## Getting Started

1. Fork this template.
2. Inside `secrets` tool, you need to insert the `db_user`, `db_pass` and `db_name` values with your favourite database settings.
3. Click the `Run` button and the database is automatically created and configured for you.

## Connecting to the Database
You can connect to the database using the secrets feature on Replit. The secrets feature allows you to store sensitive information, such as database credentials, in a separate file that is not exposed in your code.

```php
<?php
$host = "127.0.0.1";
$user = getenv("db_user");
$pass = getenv("db_pass");
$db = getenv("db_name");

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error)
    die("Connection failed: " . $conn->connect_error);
?>
```

You can access the `secrets` by calling the `getenv()` function and passing in the name of the secret as the argument. In this example, the `secrets` are used to set the values of the `$user`, `$pass` and `$db` variables, which are then used to connect to the database using the mysqli extension.

## Note

* All PHP server documents must be placed in the `htdocs` folder. This is the area where the PHP server looks for files to execute.

* Additionally, the software Adminer will be automatically downloaded. It is a web interface for managing the database and it will be accessible at the page `adminer.php`. It will allow you to perform operations such as creating, modifying, and deleting tables and managing data.

* To reset the entire database, simply delete the `sql_data` folder (use show hidden files). You can do this using this shell command:

```sh
rm -rf sql_data/
```

Please **be cautious when using this script** as it will delete all data present in the database.

## Conclusion
This template makes it easy to set up a PHP server and a MySQL (MariaDB) database on Replit. It uses the secrets feature to securely store and access sensitive information, such as database credentials. Use this template as a starting point for your own projects and adjust it to your needs.
