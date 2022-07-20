#!/bin/bash
#set -e

docker rm nginx-proxy
docker run --name nginx-proxy --network="host" -p 80:80 -p 443:443 -v $HOME/.ssl/certs:/root/.ssl/certs:ro -v $HOME/.ssl/keys:/root/.ssl/keys:ro -v $PWD/usr/share/nginx/html:/usr/share/nginx/html:ro -v $PWD/etc/nginx:/etc/nginx:ro -v $PWD/accounts:/var/lib/auth nginx
