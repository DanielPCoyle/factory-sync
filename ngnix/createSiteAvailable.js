const fs = require('fs');
const createSiteAvailable = ({ domain, deploymentPort, rootDir, host }) => {

    if (!domain) {
        return "NEED DOAMIN";
    }

    const content =  `
    server {

            root ${rootDir ?? "/var/www/html"};
            index index.html index.htm index.nginx-debian.html;

            server_name ${domain} www.${domain};

            location / {
                # try_files $uri $uri/ =404;
                try_files $uri /index.html;
            }

            location /deployment {
                    proxy_pass  ${host ?? 'http://127.0.0.1'}:${deploymentPort ?? 5002};
            }
            ${""
            /*
                +
                `
                listen [::]:443 ssl; # managed by Certbot
                listen 443 ssl; # managed by Certbot
                ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem; # managed by Certbot
                ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem; # managed by Certbot
                include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
                ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
                `
            */
            }
    }
    server {
        if ($host = ${domain}) {
            return 301 https://$host$request_uri;
        } # managed by Certbot

            listen 80;
            listen [::]:80;

        server_name ${domain} www.${domain};
    }
    `;

    fs.writeFile("/etc/nginx/sites-available/"+domain,content, err => {
        if(err){
            console.log(err)
        }
        console.log("...file created");
    })

};
exports.createSiteAvailable = createSiteAvailable;
