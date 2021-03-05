#!/bin/bash

echo 'Creating database schema'

cd database

sqlite3 database.db < schema.sql

echo 'Database set up'

cd ..