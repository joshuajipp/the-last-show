import boto3
import time
import requests
from requests_toolbelt.multipart import decoder
import base64
import hashlib
import hmac
import json


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
        "timestamp": str(int(time.time()))
    }
    files = {
        "file": open(filename, "rb")
    }

    body["signature"] = create_signature(body, api_secret)

    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload"
    res = requests.post(url, files=files, data=body)
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


def create_signature(body, api_secret):
    exclude = ["api_key", "resource_type", "cloud_name"]
    sorted_body = sort_dict(body, exclude)
    query_string = create_query_string(sorted_body)
    query_string = f"{query_string}{api_secret}"
    hashed = hashlib.sha1(query_string.encode("utf-8")).hexdigest()
    return hashed


def sort_dict(dict, exclude):
    myKeys = list(dict.keys())
    myKeys.sort()
    for i in range(len(exclude)):
        if exclude[i] in myKeys:
            myKeys.remove(exclude[i])

    return {i: dict[i] for i in myKeys}


def create_query_string(dict):
    query_string = ""
    for ind, (key, value) in enumerate(dict.items()):
        query_string = f"{key}={value}" if ind == 0 else f"{query_string}&{key}={value}"
    return query_string


print(post_cloudinary("gru.jpg"))
