gnome-terminal --tab --title="frontend" -e "$PWD/1-frontend.sh" \
  --tab-with-profile=Unnamed --title="api-server" -e "$PWD/2-api-server.sh" \
  --tab-with-profile=Unnamed --title="mongo" -e "$PWD/3-mongo.sh" \
  --tab-with-profile=Unnamed --title="nginx" -e "$PWD/4-nginx.sh"
