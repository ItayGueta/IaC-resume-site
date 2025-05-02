terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
      }
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.37"

    }
  }
}

# ---------------- Allowed IP to SSH ----------------

variable "home_ip" {
  description = "Public IPv4 address allowed to SSH"
  type        = string
  sensitive   = true
}

# ---------------- DigitalOcean Provider ----------------
variable "do_token" {
  description = "DigitalOcean Personal Access Token"
  type        = string
  sensitive   = true
}

provider "digitalocean" {
  token = var.do_token
}
# ---------------- Cloudflare Provider ----------------

variable "cf_api_token" {
  description = "Scoped Cloudflare API token for this project"
  type        = string
  sensitive   = true
}
provider "cloudflare" {
  api_token = var.cf_api_token
}


###############################################
# SSH key for terraform to use its pub half
###############################################
resource "digitalocean_ssh_key" "resume_key" {
  name       = "resume-infra"
  public_key = file("/home/osboxes/.ssh/digitalocean_ssh_key.pub")
}


###############################################
# digitalocean droplet config (hoping this is really 6$/m)
###############################################
resource "digitalocean_droplet" "web" {
  name               = "resume-site"
  region             = "fra1"
  size               = "s-1vcpu-1gb"
  image              = "ubuntu-24-10-x64"

  ssh_keys           = [digitalocean_ssh_key.resume_key.id]
  tags               = ["resume", "terraform"]

  monitoring         = true
  backups            = false
}

###############################################
# Cloud Firewall – only 22 / 80 / 443
###############################################
resource "digitalocean_firewall" "resume_fw" {
  name        = "resume-fw"
  droplet_ids = [digitalocean_droplet.web.id]

  # SSH – ideally restricted to your IP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["${var.home_ip}/32"]  }

  # HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS (we’ll add TLS soon)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Everything out is fine
  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
###############################################
# DNS Configuration
###############################################

resource "cloudflare_record" "root_a" {
  zone_id = data.cloudflare_zone.site.id
  name    = "@"
  type    = "A"
  value   = digitalocean_droplet.web.ipv4_address
  ttl     = 300
  proxied = false
}

