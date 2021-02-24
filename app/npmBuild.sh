#!/bin/bash

echo "Bundling react application..."
cd src/main/resources/static
npm run-script build
cd ../../../..
echo "Build finished"