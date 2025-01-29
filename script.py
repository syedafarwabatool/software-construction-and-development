import json
import mysql.connector

# Load JSON data
file_path = 'food_menu.json'
with open(file_path, 'r') as file:
    data = json.load(file)['menu']

# MySQL database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'FlavorFiesta'
}

# Connect to the database
try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    print("Database connected successfully!")

    # Create table if not exists
    create_table_query = """
    CREATE TABLE IF NOT EXISTS menu (
        id INT PRIMARY KEY,
        name VARCHAR(255),     
        description TEXT,
        price DECIMAL(10, 2),
        category VARCHAR(50),
        image_url TEXT
    );
    """
    cursor.execute(create_table_query)
    print("Table created or already exists.")

    # Insert data into the table
    insert_query = """
    INSERT INTO menu (id, name, description, price, category, image_url)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        price = VALUES(price),
        category = VALUES(category),
        image_url = VALUES(image_url);
    """
    for item in data:
        cursor.execute(insert_query, (
            item['id'],
            item['name'],
            item['description'],
            item['price'],
            item['category'],
            item['image_url']
        ))

    # Commit changes
    conn.commit()
    print("Data inserted successfully!")

except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
        print("Database connection closed.")
