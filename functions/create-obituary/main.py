import boto3
import time
import requests
import base64
import hashlib
import json
import datetime


def handler(event, context):
    try:
        body = event["body"]
        if type(event["body"]) == str:
            body = json.loads(body)
        base64_image = body["image"]
        image_bytes = base64.b64decode(base64_image)
        filename = "/tmp/obituary.png"

        with open(filename, "wb") as f:
            f.write(image_bytes)

        image_url = post_cloudinary(filename)["secure_url"]
        generated_text = (write_obituary(
            body["name"], body["birth_date"], body["death_date"])["choices"][0]["text"]).replace("\n", "")
        mp3_url = create_mp3(generated_text)['secure_url']
        current_date = datetime.datetime.now()
        formatted_date = current_date.strftime("%Y-%m-%d-%H-%M-%S")
        items = {
            "image_url": image_url,
            "text": generated_text,
            "mp3_url": mp3_url,
            "name": body["name"],
            "birth_date": body["birth_date"],
            "death_date": body["death_date"],
            "process_datetime": formatted_date
        }
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('the-last-show-30160521')
        table.put_item(Item=items)
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "created obituary success"
            })
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": str(e)
            })
        }


def post_cloudinary(filename, resource_type="image", extra_fields={}):
    api_data_string = boto3.client('ssm').get_parameter(
        Name="CloudinaryKey", WithDecryption=True)["Parameter"]["Value"]

    api_data_list = api_data_string.split(",")

    cloud_name = api_data_list[0]
    api_key = api_data_list[1]
    api_secret = api_data_list[2]

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
    filename = "/tmp/obituary.mp3"
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


def write_obituary(name, birth_date, death_date):
    api_key = boto3.client('ssm').get_parameter(
        Name="OpenAIKey", WithDecryption=True)["Parameter"]["Value"]
    url = "https://api.openai.com/v1/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    body = {
        "model": "text-curie-001",
        "prompt": f"write an obituary about a fictional character \
            named {name} who was born on {birth_date} and died on {death_date}",
        "max_tokens": 600,
        "temperature": 0.1,
    }

    res = requests.post(url, headers=headers, json=body, timeout=15)
    return res.json()
