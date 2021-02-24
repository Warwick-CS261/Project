#!/bin/bash

echo "Installing npm packages..."
cd src/main/resources/static
npm install
cd ../../../..
echo "Packages installed"