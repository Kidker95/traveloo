// Creating MongoDB user for accessing northwind database.
// This file must run first, thus it starts with "1-".
// The MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD gives credentials to admin database and not to northwind database.

const db = connect("mongodb://127.0.0.1:27017/traveloo");

// Create a user for Traveloo:
db.createUser({
    user: "Omri",
    pwd: "Shachar",
    roles: [{ db: "traveloo", role: "readWrite" }]
});

print("Successfully Created User For Traveloo.");

