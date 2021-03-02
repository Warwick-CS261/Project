#!/bin/bash

echo 'Bulding docker image: '
docker build -t cs261g45/project:1.0 .
echo 'Build finished'

echo 'Running docker image: '
docker run -p 6969:6969 cs261g45/project:1.0
