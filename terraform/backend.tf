terraform {
  backend "s3" {
    bucket = "focus-flow-tfstate-12345"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}