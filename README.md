# IaC-resume-site

A personal resume website project and technical showcase. This repository demonstrates my ability to independently design, secure, and automate cloud infrastructure and deployment pipelines using modern DevOps best practices. The site is visually powered by [Hugo](https://gohugo.io/), hosted on a DigitalOcean droplet, provisioned via [Terraform](https://www.terraform.io/) and configured with [Ansible](https://www.ansible.com/).  

DNS, security, and performance are managed with [Cloudflare](https://www.cloudflare.com/), and all web traffic is secured with Let's Encrypt.

## Features

- **End-to-End Infrastructure as Code:** Deploys a secure, production-ready site using Terraform and Ansible with minimal manual intervention.
- **Automated Security:**  
  - SSH access locked down to home IP and GitHub Actions workers (with chunked firewall rules to accommodate >5000 worker IPs).
  - Root SSH and password authentication are disabled; only the `deploy` user with SSH key and passwordless sudo can access the server.
  - Firewall open only on ports 22, 80, and 443.
- **Modern Static Site:** Hugo is used for fast, visually appealing content and theming.
- **Continuous Deployment:** GitHub Actions builds and deploys on every résumé update, with credentials handled securely via GitHub Secrets.
- **Let's Encrypt TLS:** Automated SSL for HTTPS out-of-the-box.
- **Cloudflare Fronting:** DNS, DDoS protection, and additional SSL/TLS support.

## Stack

- **Infrastructure as Code:** Terraform, Ansible
- **Hosting:** DigitalOcean Droplet (ubuntu-24-10-x64)
- **DNS / CDN / SSL:** Cloudflare, Let's Encrypt
- **Static Site Generator:** Hugo
- **Languages:** HCL (Terraform), YAML (Ansible), HTML, Markdown

## Project Structure

- `terraform/` — Infrastructure code for DigitalOcean, Cloudflare, and firewall setup.
- `ansible/` — Playbooks and inventory for server hardening, user setup, and deployment.
- `site/` — Hugo project (themes, content, and static assets).
- `.github/workflows/` — GitHub Actions deployment pipeline.

## Usage

> **Note:** This project is a technical showcase of mine and is not intended nor designed as a template.

## Continuous Deployment

Automated deployment is handled via a project-specific GitHub Actions workflow. On resume updates, the CI builds the Hugo site and deploys it to the server using SSH and rsync.  
_Note: The workflow is included for reference and is not intended for general use without custom configuration and secrets._

## Security Summary

- **SSH:** Access is limited to my home IP and GitHub Actions worker IPs. (Worker IPs split into 1000-IP firewall rules due to DigitalOcean limits.)
- **Server:** Root login and password SSH disabled. Only the `deploy` user (key only, passwordless sudo) can interact.
- **Web:** HTTPS everywhere via Let's Encrypt and Cloudflare.

## Contributing

This is a personal showcase project; external contributions are not accepted at this time. For suggestions or questions, open an issue or just contact me directly.

## License

see .LICENSE.md
## Author

[Itay Gueta](https://itaygueta.com)  
[github.com/ItayGueta](https://github.com/ItayGueta)

## Credits

This site uses the [Ananke theme](https://github.com/theNewDynamic/gohugo-theme-ananke) for Hugo, © theNewDynamic, licensed under the [MIT License](https://github.com/theNewDynamic/gohugo-theme-ananke/blob/master/LICENSE).  
The theme’s LICENSE file is retained in the project as required.

---
