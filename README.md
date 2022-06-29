# monorepo

Monorepo containing all code (frontend, backend, etc.)

```
#install docker (or Docker Desktop for Mac) 

#Linux only
#add DOCKER_HOST to .bashrc 
systemctl --user start docker.service

#Create Personal Auth Token on Github 
#https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
#login with PAT
docker login ghcr.io -u YOUR-GITHUB-EMAIL

git clone git@github.com:romeano-inc/monorepo.git
cd monorepo/romeano
docker pull ghcr.io/romeano-inc/core-app:latest
```

add:
net.ipv4.ip_unprivileged_port_start=80
to
/etc/sysctl.conf

then run:
sudo sysctl -p

docker-compose up

#add stuff to uploads dir
chmod 777 uploads
