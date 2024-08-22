import base64
import requests



# Function to encode the image
def encode_image(image_bytes):
  return base64.b64encode(image_bytes).decode('utf-8')

# Path to your image
#image_path = "photo_2024-08-22 20.10.57.jpeg"

def image_extractor(image_bytes):
  # # Getting the base64 string
  base64_image = encode_image(image_bytes)

  headers = {
    "Content-Type": "application/json",
    
  }

  payload = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Give me all the text in the image. Provide the response as a string with only the text from the image and no more."
          },
          {
            "type": "image_url",
            "image_url": {
              "url": f"data:image/jpeg;base64,{base64_image}"
            }
          }
        ]
      }
    ],
    "max_tokens": 1000
  }

  response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

  response_json = response.json()

  return response_json['choices'][0]['message']['content']