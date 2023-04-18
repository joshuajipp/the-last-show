import boto3
import time
import requests


def lambda_handler():
    pass


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
