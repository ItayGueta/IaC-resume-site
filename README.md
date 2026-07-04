# IaC-resume-site

This is my personal resume site, plus the infrastructure behind it.

I built it as a real project instead of a slide deck: [Hugo](https://gohugo.io/) for the site, [Terraform](https://www.terraform.io/) for infrastructure, [Ansible](https://www.ansible.com/) for server setup, and GitHub Actions for deployment.

It runs on a DigitalOcean droplet, fronted by [Cloudflare](https://www.cloudflare.com/), with TLS from Let's Encrypt.

## Features

- **Infrastructure as code:** Full infra + configuration flow in Terraform and Ansible.
- **Locked-down SSH:** Root/password SSH disabled, deploy user only, firewall limited to required ports.
- **Automated deploys:** GitHub Actions builds and ships site updates to the server.
- **Branch testing on beta:** non-`master` branch deploys go to `beta.itaygueta.com`.
- **TLS by default:** HTTPS via Let's Encrypt (managed through Ansible/Certbot).
- **Cloudflare in front:** DNS and edge protection.

## Stack

- **Infrastructure as Code:** Terraform, Ansible
- **Hosting:** DigitalOcean Droplet
- **DNS / CDN / SSL:** Cloudflare, Let's Encrypt
- **Static Site Generator:** Hugo
- **Languages:** HCL (Terraform), YAML (Ansible), HTML, Markdown

## Project Structure

- `terraform/` — Infrastructure code for DigitalOcean, Cloudflare, and firewall setup.
- `ansible/` — Playbooks and inventory for server hardening, user setup, and deployment.
- `site/` — Hugo project (themes, content, and static assets).
- `.github/workflows/` — GitHub Actions deployment pipeline.

## Why this exists

I wanted one project that reflects how I actually work: ship small, automate boring stuff, and keep infra readable.

This repo is not meant to be a plug-and-play template, but you can still reuse ideas from it.

## Continuous Deployment

Automated deployment is handled by GitHub Actions. On site changes, CI builds the Hugo site and deploys it to the server using SSH + rsync.  
_Note: The workflow is included for reference and is not intended for general use without custom configuration and secrets._

Deployment targets:
- `master` -> `itaygueta.com` (`/var/www/resume-site/`)
- non-`master` branches -> `beta.itaygueta.com` (`/var/www/resume-site-beta/`)

## Security Summary

- **SSH:** Access is allowlisted (home IP + CI ranges if enabled).
- **Server:** Root login and password SSH are disabled.
- **Web:** HTTPS via Let's Encrypt and Cloudflare.

## Contributing

This is a personal project, so I am not accepting external contributions right now. If you have feedback, feel free to open an issue.

## License

See `LICENSE`.
## Author

[Itay Gueta](https://itaygueta.com)  
[github.com/ItayGueta](https://github.com/ItayGueta)

## Credits

This site uses the [Ananke theme](https://github.com/theNewDynamic/gohugo-theme-ananke) for Hugo, © theNewDynamic, licensed under the [MIT License](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/LICENSE).  
The theme’s LICENSE file is retained in the project as required.

---
