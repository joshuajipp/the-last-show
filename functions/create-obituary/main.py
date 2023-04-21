import boto3
import time
import requests
from requests_toolbelt.multipart import decoder
import base64
import hashlib


def lambda_handler(event, context):
    body = event["body"]
    base64_image = body["image"]
    image_bytes = base64.b64decode(base64_image)
    filename = "obituary.png"

    with open(filename, "wb") as f:
        f.write(image_bytes)

    image_url = post_cloudinary(filename)['secure_url']
    generated_text = write_obituary(
        body["name"], body["birth_year"], body["death_year"])["choices"][0]["text"]
    mp3_url = create_mp3(generated_text)['secure_url']
    items = {
        "image_url": image_url,
        "text": generated_text,
        "mp3_url": mp3_url,
        "name": body["name"],
        "birth_year": body["birth_year"],
        "death_year": body["death_year"]
    }
    return items


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
    filename = "obituary.mp3"
    with open(filename, "wb") as f:
        f.write(response["AudioStream"].read())
    return post_cloudinary(filename, "raw")


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


def write_obituary(name, birth_year, death_year):
    url = "https://api.openai.com/v1/completions"
    api_key = ""

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    body = {
        "model": "text-curie-001",
        "prompt": f"write an obituary about a fictional character \
            named {name} who was born on {birth_year} and died on {death_year}",
        "max_tokens": 600,
        "temperature": 0.1,
    }

    res = requests.post(url, headers=headers, json=body)
    return res.json()


# print(post_cloudinary("gru.jpg"))
# print(create_mp3("Hello, my name is Gru. I love minions.")['secure_url'])
print(write_obituary("Wolfgang Amadeus Mozart",
      "02-01-1990", "05-10-2020")["choices"][0]["text"])
