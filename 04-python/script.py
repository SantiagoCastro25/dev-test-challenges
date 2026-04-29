
import re
from collections import defaultdict #add the dictionary to use regex

users = [
    {"name": "Alice", "email": "alice@gmail.com"},
    {"name": "Bob",   "email": "bob@yahoo.com"},
    {"name": "Carol", "email": "alice@gmail.com"},   
    {"name": "Dave",  "email": "dave@gmail.com"},
    {"name": "Eve",   "email": "not-an-email"},      
    {"name": "Frank", "email": "frank@"},            
]

EMAIL_REGEX = re.compile(r'^[\w\.\+\-]+@[\w\-]+\.[a-zA-Z]{2,}$') # Regex: Ahora el regex exige 3 partes obligatorias: parte local + @ + dominio con TLD (.com, .co,

def validate_email(email : str) -> bool:
    return bool(EMAIL_REGEX.match(email))

def group_by_domain(users: list[dict]) -> dict:
    seen_emails = set()          # localiza duplicaciones
    domain_counts = defaultdict(int)

    for user in users:
        email = user["email"].strip().lower()

        if not validate_email(email):
            continue             # skip invalid

        if email in seen_emails:
            continue             # skip duplicates     
            
        seen_emails.add(email)
        domain = email.split("@")[1]   # toma solo lo que está DESPUÉS del @
        domain_counts[domain] += 1     # suma sobre el valor existente

    return dict(domain_counts)

output = group_by_domain(users)
print(output)
