import requests

response = requests.post(
    "http://127.0.0.1:5000/api/auth/register",
    json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "test1234"
    }
)

print(response.status_code)
print(response.json())