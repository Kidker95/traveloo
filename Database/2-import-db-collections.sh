# Importing existing collections via shell command.
# mongorestore is part of Mongo Tools which placed inside /bin folder.
# mongorestore syntax: mongorestore -d <database-name> <dupm-folder>
/bin/mongorestore -d traveloo /docker-entrypoint-initdb.d/traveloo

# Print success message:
echo "Successfully Imported Collections."
