#!/usr/bin/env bash
# Install script that downloads all the required npm modules for each function and zips them up.

echo "Building Micro Function..."
cd functions/micro
# Micro function has no npm imports
zip micro.zip micro.js

echo "Building Small Function..."
cd ../small
npm install
zip -r small.zip small.js node_modules package.json

echo "Building Medium Function..."
cd ../medium
npm install
zip -r medium.zip medium.js node_modules package.json

echo "Building Large Function..."
cd ../large
npm install
zip -r large.zip large.js node_modules package.json

echo "Building ExtraLarge Function..."
cd ../extraLarge
npm install
zip -r extraLarge.zip extraLarge.js node_modules package.json

echo "Building Huge Function..."
cd ../huge
npm install
zip -r huge.zip huge.js node_modules package.json

echo "Building Insane Function..."
cd ../insane
npm install
zip -r insane.zip insane.js node_modules package.json