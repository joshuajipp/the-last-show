terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

# two lambda functions w/ function url
# one dynamodb table
# roles and policies as needed
# step functions (if you're going for the bonus marks)

data "archive_file" "lambda_create_obituary" {
  type = "zip"

  source_dir  = "../functions/create-obituary"
  output_path = "./create-obituary.zip"
}

data "archive_file" "lambda_get_obituaries" {
  type = "zip"

  source_dir  = "../functions/get-obituaries"
  output_path = "./get-obituaries.zip"
} 
