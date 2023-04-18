import boto3
import time
import requests
from requests_toolbelt.multipart import decoder
import base64


def lambda_handler(event, context):
    body = event("body")

    if event["isBase64Encoded"]:
        body = base64.b64decode(body)

    content_type = event["headers"]["content-type"]
    data = decoder.MultipartDecoder(body, content_type)

    binary_data = [parts.content for parts in data.parts]

    file_name = "obituary.png"
    with open(file_name, "wb") as f:
        f.write(binary_data[0])
    post_cloudinary(file_name)


def post_cloudinary(filename, resource_type="image", extra_fields={}):
    api_key = "813499744365815"
    cloud_name = "dwviwvswa"
    api_secret = ""

    body = {
        "api_key": api_key,
        "timestamp": int(time.time())
    }
    files = {
        "file": open(filename, "rb")
    }
    timestamp = int(time.time())
    body["signature"] = create_signature(body, api_secret)

    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload"
    res = requests.post(url, data=body, files=files)
    return res.json()


def create_mp3(text):
    client = boto3.client('polly')
    response = client.synthesize_speech(
        Engine='standard',
        LanguageCode='en-US',
        OutputFormat='mp3',
        Text=text,
        TextType='text',
        VoiceId='Joanna'
    )
