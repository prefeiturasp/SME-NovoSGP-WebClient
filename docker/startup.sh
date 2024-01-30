#!/bin/sh
echo "Inicializando a Aplicação..."
echo "REACT_APP_URL_API = ${REACT_APP_URL_API}"
echo "REACT_APP_TRACKING_ID = ${REACT_APP_TRACKING_ID}"
echo "REACT_APP_URL_SONDAGEM = ${REACT_APP_URL_SONDAGEM}"
echo "REACT_APP_URL_SIGNALR = ${REACT_APP_URL_SIGNALR}"
echo "REACT_APP_CES_URL = ${REACT_APP_CES_URL}"
echo "REACT_APP_CES_TOKEN = ${REACT_APP_CES_TOKEN}"
cd /usr/share/nginx/html/static/js
files=$(ls)
for file in $files
do
  cp $file /tmp/$file
  rm $file
  envsubst '${REACT_APP_URL_API},${REACT_APP_TRACKING_ID},${REACT_APP_URL_SONDAGEM},${REACT_APP_URL_SIGNALR},${REACT_APP_CES_URL},${REACT_APP_CES_TOKEN}' < /tmp/$file > $file
done

nginx -g 'daemon off;'
