terraform {
  required_version = ">= 1.5.0"

  required_providers {
    http = {
      source  = "hashicorp/http"
      version = "~> 3.5"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.37"
    }
  }
}

variable "project_name" {
  description = "Short project identifier used for resource names"
  type        = string
  default     = "resume-site"
}

variable "home_ip" {
  description = "Public IPv4 address allowed to SSH"
  type        = string
  sensitive   = true
}

variable "ssh_additional_cidrs" {
  description = "Additional CIDR ranges allowed to SSH"
  type        = list(string)
  default     = []
}

variable "allow_github_actions_ssh" {
  description = "Allow GitHub-hosted Actions runners to SSH for CI deploys"
  type        = bool
  default     = true
}

variable "droplet_region" {
  description = "DigitalOcean region"
  type        = string
  default     = "fra1"
}

variable "droplet_size" {
  description = "DigitalOcean droplet size"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "droplet_image" {
  description = "DigitalOcean droplet image slug"
  type        = string
  default     = "ubuntu-24-10-x64"
}

variable "do_ssh_public_key_path" {
  description = "Path to the SSH public key uploaded to DigitalOcean"
  type        = string
}

variable "do_token" {
  description = "DigitalOcean Personal Access Token"
  type        = string
  sensitive   = true
}

variable "cf_api_token" {
  description = "Scoped Cloudflare API token for this project"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone id for the managed domain"
  type        = string
}

variable "cloudflare_record_name" {
  description = "Cloudflare DNS name for the resume site"
  type        = string
  default     = "@"
}

locals {
  ssh_base_cidrs      = concat(["${var.home_ip}/32"], var.ssh_additional_cidrs)
  github_actions_ipv4 = var.allow_github_actions_ssh ? [for cidr in jsondecode(data.http.github_meta[0].response_body).actions : cidr if length(regexall(":", cidr)) == 0] : []
  ssh_source_cidrs    = concat(local.ssh_base_cidrs, local.github_actions_ipv4)
  ssh_cidr_chunks     = chunklist(local.ssh_source_cidrs, 1000)
}

data "http" "github_meta" {
  count = var.allow_github_actions_ssh ? 1 : 0
  url   = "https://api.github.com/meta"

  request_headers = {
    Accept = "application/vnd.github+json"
  }
}

provider "digitalocean" {
  token = var.do_token
}

provider "cloudflare" {
  api_token = var.cf_api_token
}

resource "digitalocean_ssh_key" "resume_key" {
  name       = "${var.project_name}-infra"
  public_key = file(var.do_ssh_public_key_path)
}

resource "digitalocean_droplet" "web" {
  name   = var.project_name
  region = var.droplet_region
  size   = var.droplet_size
  image  = var.droplet_image

  ssh_keys = [digitalocean_ssh_key.resume_key.id]
  tags     = ["resume", "terraform"]

  monitoring = true
  backups    = false
}

resource "digitalocean_firewall" "resume_fw" {
  name        = "${var.project_name}-fw"
  droplet_ids = [digitalocean_droplet.web.id]

  dynamic "inbound_rule" {
    for_each = local.ssh_cidr_chunks
    content {
      protocol         = "tcp"
      port_range       = "22"
      source_addresses = inbound_rule.value
    }
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

resource "cloudflare_record" "root_a" {
  zone_id = var.cloudflare_zone_id
  name    = var.cloudflare_record_name
  type    = "A"
  value   = digitalocean_droplet.web.ipv4_address
  ttl     = 300
  proxied = false
}

output "droplet_ipv4" {
  value = digitalocean_droplet.web.ipv4_address
}

