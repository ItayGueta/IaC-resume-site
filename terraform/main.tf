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
