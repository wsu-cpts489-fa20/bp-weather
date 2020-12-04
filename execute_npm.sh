#!/usr/bin/env bash

echo "Press 'y' if npm not installed"
count=0
while : ; do
read -n 1 k <&1
if [[ $k = y ]] ; then
cd client;
npm install;
npm run build;
cd ..;
npm install;
npm run build;
npm start
break
else
cd client;
npm run build;
cd ..;
npm run build;
npm start
fi
done
