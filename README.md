# monorepo

Monorepo containing all code (frontend, backend, etc.)

#install docker
#add DOCKER_HOST to bashrc
systemctl --user start docker.service

#login with PAT
docker login ghcr.io -u e.semeniuc

git clone git@github.com:romeano-inc/monorepo.git
cd monorepo/romeano
docker pull ghcr.io/romeano-inc/core-app:latest

add:
net.ipv4.ip_unprivileged_port_start=80
to
/etc/sysctl.conf

then run:
sudo sysctl -p

docker-compose up

#add stuff to uploads dir
chmod 777 uploads
