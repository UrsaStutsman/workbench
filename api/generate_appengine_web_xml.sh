#!/bin/bash -e
echo "DB CONNECTION = ${DB_CONNECTION_STRING}"
cat src/main/webapp/WEB-INF/appengine-web.xml.template | envsubst > src/main/webapp/WEB-INF/appengine-web.xml
