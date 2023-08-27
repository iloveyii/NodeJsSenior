#!/bin/bash
echo "Reseting db ..."
docker-compose down
docker-compose up -d
# wait for db to start
sleep 10
source ~/.bash_profile
npx prisma migrate dev --name init