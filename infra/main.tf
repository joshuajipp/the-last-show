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

resource "aws_iam_role" "lambda_role" {
  name               = "iam-role-lambda-obituaries"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_lambda_function" "create_obituary_lambda" {
  filename         = "./create-obituary.zip"
  function_name    = "create-obituary-30144999"
  role             = aws_iam_role.lambda_role.arn
  handler          = "main.handler"
  runtime          = "python3.9"
  source_code_hash = filebase64sha256("./create-obituary.zip")
}

resource "aws_lambda_function" "get_obituaries_lambda" {
  filename         = "./get-obituaries.zip"
  function_name    = "get-obituaries-30144999"
  role             = aws_iam_role.lambda_role.arn
  handler          = "main.handler"
  runtime          = "python3.9"
  source_code_hash = filebase64sha256("./get-obituaries.zip")
}

resource "aws_dynamodb_table" "obituaries_dynamodb_table" {
  name         = "the-last-show-30160521"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1

  # up to 1KB per second
  write_capacity = 1

  hash_key = "image_url"

  # the hash_key data type is string
  attribute {
    name = "image_url"
    type = "S"
  }

}

resource "aws_iam_policy" "parameter_store_policy" {
  name = "parameter_store_policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "parameter_store_policy_attachment" {
  policy_arn = aws_iam_policy.parameter_store_policy.arn
  role       = aws_iam_role.lambda_role.name
}
resource "aws_iam_policy" "dynamodb_policy" {
  name        = "dynamodb-policy-the-last-show"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
                "dynamodb:BatchGet*",
                "dynamodb:DescribeStream",
                "dynamodb:DescribeTable",
                "dynamodb:Get*",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWrite*",
                "dynamodb:CreateTable",
                "dynamodb:Delete*",
                "dynamodb:Update*",
                "dynamodb:PutItem"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  policy_arn = aws_iam_policy.dynamodb_policy.arn
  role       = aws_iam_role.lambda_role.name
}

resource "aws_lambda_function_url" "url_create_obituary" {
  function_name      = aws_lambda_function.create_obituary_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "url_get_obituaries" {
  function_name      = aws_lambda_function.get_obituaries_lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}