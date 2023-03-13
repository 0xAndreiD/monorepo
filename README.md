# monorepo

Monorepo containing all code (frontend, backend, etc.)

Running app locally:

```
[start from root folder, /monorepo]
git pull origin master
cd romeano/
yarn install
blitz dev
```

```
#install docker (or Docker Desktop for Mac)

#Linux only
#add DOCKER_HOST to .bashrc
systemctl --user start docker.service

#Create Personal Auth Token on Github
#https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
#you can select the amount of days until renewal, eventually a security process will specify times
#login with your PAT copied from Github
docker login ghcr.io -u YOUR-GITHUB-UNAME

#Make sure you have created a SSH token and added it to your GitHub account before the next step
#https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
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
```
