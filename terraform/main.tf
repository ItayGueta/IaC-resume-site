terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Why pin versions?  ◄─ add your own comment here:
#   Guarantees the same provider release on every clone/CI run, avoids
#   "it works on my box" drift.

variable "cf_api_token" {
  description = "Scoped Cloudflare API token for this project"
  type        = string
  sensitive   = true
}

provider "cloudflare" {
  api_token = var.cf_api_token
}
