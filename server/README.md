## Setup

### Local
#### Dependencies
- Node 13+
- yarn 1.22+
- [docker 19.03+](https://github.com/docker/docker-install) (for building images)
- [docker-compose](https://github.com/docker/compose) (for building images)

#### Arch setup
```bash
sudo pacman -S yarn pdftk java-commons-lang docker docker-compose poppler
```

#### Mac setup
```bash
brew install yarn node poppler
```
Also install [Docker for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)

### Server

#### Connecting to the server
```ssh -L 8081:localhost:8081 root@vps287158.vps.ovh.ca```

Note: we use port 8081 for accessing [mitmweb](https://mitmproxy.readthedocs.io/en/v2.0.2/mitmweb.html) to debug interactions between the client and server

### Server setup

```bash
apt update && apt install -y curl git tmux mosh #tmux for logging, mosh for fast ssh

curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo systemctl enable docker

#make key
cat /dev/zero | ssh-keygen -q -N ""
cat ~/.ssh/id_rsa.pub

git clone git@github.com:Romeano-Inc/monorepo.git
cd server
tmux #make new session
docker-compose up
```
# Nginx settings
[Nginx config](https://www.digitalocean.com/community/tools/nginx#?0.domain=romeano.com&0.path=%2Fhome%2Fromeano%2F&0.document_root=build&0.cert_type=custom&0.email=hackerhousealpha@gmail.com&0.ssl_certificate=%2Fetc%2Fletsencrypt%2Flive%2Fromeano.com%2Ffullchain.pem&0.ssl_certificate_key=%2Fetc%2Fletsencrypt%2Flive%2Fromeano.com%2Fprivkey.pem&0.php=false&0.proxy&0.proxy_path=~%20%5E%2F(graphql%7CfileUpload%7CcheckoutOrderApproved%7CpaymentCaptureCompleted%7CfaxStatusCallback)&0.proxy_pass=http:%2F%2Fmitmproxy:8080&0.fallback_html&limit_req&user=nginx&client_max_body_size=25)

## Deployment
Make sure you are in the git root (not in `server`)
1. Build local image: `docker-compose build --parallel --pull`
2. Log in to Docker hub: `docker login` (do this once only, it saves your login info)
3. Push built images to docker hub: `docker-compose push`
4. [Connect to the server](#connecting-to-the-server)
5. Attach to the existing tmux session: `tmux a -t 0`
6. Open a new window to pull in the new image in the background: `Ctrl-B, C` to create a new window, `cd /root/romeano` to go to the root folder
7. Pull in the new images: `docker-compose pull`
8. Shut down the old instance: `docker-compose down -v`
9. Start the new instance in window 0: `Ctrl-B, 0` to switch to window 0, `docker-compose up` to start the server
10. Disconnect from the server `Ctrl-B, D` to disconnect from tmux

## Accessing mitmweb
1. [Connect to the server](#connecting-to-the-server)
2. Open http://localhost:8081/
3. Inspect any incoming requests


