output "frontend_url" {
  description = "URL du frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "backend_url" {
  description = "URL du backend"
  value       = "http://${aws_instance.backend.public_ip}:5000"
}

output "s3_bucket_name" {
  description = "Nom du bucket S3"
  value       = aws_s3_bucket.frontend.bucket
}

output "instance_public_ip" {
  description = "IP publique de l'instance EC2"
  value       = aws_instance.backend.public_ip
}