# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal resume site at `itaygueta.com` — a Hugo static site deployed to a single DigitalOcean droplet, fronted by Cloudflare DNS, with Let's Encrypt TLS. The full stack is infrastructure-as-code: Terraform provisions the droplet and DNS, Ansible hardens the server and configures nginx, and GitHub Actions builds the Hugo site and ships it via rsync.

See `AGENTS.md` for detailed code style, naming conventions, and ground rules. That file is the authoritative style guide; this one covers architecture and workflows.

## Common Commands

All run from repo root unless noted.

**Hugo (site)**
- Dev server: `hugo server -s site`
- Production build: `hugo --minify -s site`
- Build with drafts: `hugo -s site -D -F`

**Terraform**
- Format: `terraform -chdir=terraform fmt -recursive`
- Validate: `terraform -chdir=terraform validate`
- Plan: `terraform -chdir=terraform plan`

**Ansible** (run from WSL)
- Syntax check: `ansible-playbook -i ansible/hosts.yml ansible/playbook.yml --syntax-check`
- Dry run: `ansible-playbook -i ansible/hosts.yml ansible/playbook.yml --check --diff`
- Apply: `ansible-playbook -i ansible/hosts.yml ansible/playbook.yml`

There is no formal test suite. Validation is through the commands above plus the CI smoke check (`curl` against the deployed URL).

## Architecture

### Branch → Environment Mapping

| Branch | Deploy Target | Web Root |
|---|---|---|
| `master` | `itaygueta.com` | `/var/www/resume-site/` |
| Any other branch | `beta.itaygueta.com` | `/var/www/resume-site-beta/` |

The CI workflow (`deploy_site` job) sets `DEPLOY_PATH` and `HUGO_BASE_URL` dynamically based on the branch name. Manual override is available via `workflow_dispatch` inputs (`auto|beta|production`). The workflow uses GitHub Environments (`production` / `beta`) for secret scoping. Deploy only runs on `push` and `workflow_dispatch` — PR builds validate only.

### Infrastructure Provisioning Flow

1. **Terraform** (`terraform/main.tf`) provisions:
   - A single DigitalOcean droplet (Ubuntu 24.04, s-1vcpu-1gb, fra1 by default)
   - SSH key uploaded to DO
   - Firewall: SSH (22) allowlisted to home IP + optionally GitHub Actions IP ranges (fetched from GitHub's `/meta` API); HTTP/HTTPS (80/443) open to the world
   - Two Cloudflare A records (`@` and `beta`) pointing to the droplet IP

2. **Ansible** (`ansible/playbook.yml`) configures the droplet:
   - Installs nginx, ufw, certbot
   - Creates a `deploy` user with passwordless sudo (used by CI for rsync)
   - Hardens SSH: disables root login and password authentication
   - Enables UFW for ports 22, 80, 443
   - Creates two web roots (`/var/www/resume-site/` and `/var/www/resume-site-beta/`)
   - Deploys nginx server blocks from a Jinja2 template (`ansible/templates/resume-site.conf.j2`)
   - Obtains a single Let's Encrypt certificate covering BOTH domains (`itaygueta.com` and `beta.itaygueta.com`)
   - Enables certbot auto-renewal timer

3. **GitHub Actions** (`.github/workflows/main.yml`) builds and deploys:
   - `validate_site` job runs on every push/PR touching relevant paths — builds Hugo to catch errors
   - `deploy_site` job (push/workflow_dispatch only, depends on validate) builds Hugo with the correct `--baseURL` and rsyncs `site/public/` to the appropriate web root on the droplet via the `deploy` user and SSH key from GitHub Secrets
   - Concurrency is grouped by `github.ref` with cancel-in-progress

### Site Layer

- **Generator:** Hugo extended v0.148.2 with the Ananke theme (v2.12.1, vendored at `site/themes/ananke/`)
- **Multilingual:** English (`content/`) and German (`content/de/`), with `defaultContentLanguageInSubdir = true`
- **Customizations** go in `site/layouts/` and `site/static/` overrides — never modify vendored theme files directly
  - `site/layouts/partials/site-header.html` adds a language toggle (EN/DE flags)
  - `site/layouts/shortcodes/pdf.html` embeds the CV PDF via `<object>` tag
  - `site/static/custom.css` provides all custom styling
- **Generated output** (`site/public/`, `site/resources/_gen/`) is gitignored

### Security Posture

- SSH: home-IP-allowlisted, root login disabled, password auth disabled, deploy-user-only key access
- Web: HTTPS enforced via Let's Encrypt (certbot `--hsts --staple-ocsp --redirect`)
- Secrets: everything sensitive lives in GitHub Secrets or Terraform sensitive variables — never in files
- Firewall: only ports 22 (restricted), 80, and 443 are open

## Design Decisions

Design logs in `design-log/` document architectural decisions:
- `001-beta-branch-testing-and-infra-rework.md` — rationale for the beta environment, Terraform/Ansible rework, and branch-aware deploys
- `002-beta-403-recovery-and-deploy-hardening.md` — post-mortem on a beta deploy failure, leading to expanded workflow triggers and manual deploy override
