variable "aws_region" {
  description = "Région AWS"
  type        = string
  default     = "eu-west-3"  # Paris
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "focus-flow"
}

variable "ssh_key_name" {
  description = "Nom de la clé SSH pour accéder à l'instance"
  type        = string
  default     = "focus-flow-key"
}
