# monorepo

Monorepo containing all code (frontend, backend, etc.)

#install docker
#add DOCKER_HOST to bashrc
systemctl --user start docker.service

#login with PAT
docker login ghcr.io -u e.semeniuc

git clone git@github.com:romeano-inc/monorepo.git
cd monorepo/romeano
docker-compose up
