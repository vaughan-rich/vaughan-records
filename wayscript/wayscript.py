import requests
import urllib3
import time
import base64
from urllib import parse
import os
import json
import gspread
import pandas as pd
from gspread_dataframe import get_as_dataframe, set_with_dataframe
from oauth2client.service_account import ServiceAccountCredentials

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ONCE I GET BEYOND 100 RELEASES, I 'LL NEED TO INCORPORATE PAGINATION
base_url = "https://api.discogs.com"
headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
}
token = "token=INSERT_TOKEN_HERE"

 # COLLECTION VALUE REQUEST
req_string = "/users/USERNAME/collection/value?"
res = requests.get(base_url + req_string + token, headers = headers)
collectionValue = res.json()

# RELEASE LIST REQUEST
# ONCE I GET BEYOND 100 RELEASES, I'LL NEED TO INCORPORATE PAGINATION
req_string = "/users/USERNAME/collection/folders/0/releases?callback=&sort=added&sort_order=desc&per_page=100"
res = requests.get(base_url + req_string + "&" + token, headers = headers)
releaseList = res.json()["releases"]

collectionData = []
for release in releaseList:
  # # ARTISTS LOOP
  artist_names = []
  for artist in release['basic_information']['artists']:
    artist_names.append(artist['name'])

  # # FORMATS LOOP
  format_names = []
  for format in release['basic_information']['formats']:
    format_names.append(format['name'])

  # # FORMAT DESCRIPTIONS LOOP
  format_descs = []
  for format in release['basic_information']['formats']:
    if "descriptions" in format:
      format_descs.append(', '.join(format['descriptions']))

  # # LABELS LOOP
  label_names = []
  for label in release['basic_information']['labels']:
    label_names.append(label['name'])

  # SINGLE RELEASE VALUE REQUEST
  req_string = "/marketplace/price_suggestions/" + str(release["id"])
  res = requests.get(base_url + req_string + "?" + token, headers = headers)
  requestValue = res.json()

  print("\n")
  print(release['basic_information']['title'])
  time.sleep(1.1)

  # PRICE SUGGESTION SWITCH STATEMENT
  if release['notes'][0]['value'] == 'Mint (M)':
    suggestedPrice = requestValue['Mint (M)']['value']
    print('Release is Mint and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Good (G)':
    suggestedPrice = requestValue['Good (G)']['value']
    print('Release is Good and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Good Plus (G+)':
    suggestedPrice = requestValue['Good Plus (G+)']['value']
    print('Release is Good Plus and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Near Mint (NM or M-)':
    suggestedPrice = requestValue['Near Mint (NM or M-)']['value']
    print('Release is Near Mint and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Fair (F)':
    suggestedPrice = requestValue['Fair (F)']['value']
    print('Release is Fair and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Very Good (VG)':
    suggestedPrice = requestValue['Very Good (VG)']['value']
    print('Release is Very Good and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Very Good Plus (VG+)':
    suggestedPrice = requestValue['Very Good Plus (VG+)']['value']
    print('Release is Very Good Plus and value is ' + str(suggestedPrice))
  elif release['notes'][0]['value'] == 'Poor (P)':
    suggestedPrice = requestValue['Poor (P)']['value']
    print('Release is Poor and value is ' + str(suggestedPrice))
  else:
    print('Switch Statement Didnt Work...')  


  schema = {
    "Artist(s)": ', '.join(artist_names),
    "Title": release['basic_information']['title'],
    "Year": release['basic_information']['year'],
    "Label(s)": ', '.join(label_names),
    "Format(s)": ', '.join(format_names),
    "Format Description(s)": ', '.join(format_descs),
    "Genre(s)": ', '.join(release['basic_information']['genres']),
    "Style(s)": ', '.join(release['basic_information']['styles']),
    "Cover Image URL": release['basic_information']['cover_image'],
    "Media Condition": release['notes'][0]['value'],
    "Sleeve Condition": release['notes'][1]['value'],
    "Marketplace Price Suggestion": suggestedPrice,
    "Min Collection Value": collectionValue["minimum"],
    "Median Collection Value": collectionValue["median"],
    "Max Collection Value": collectionValue["maximum"]
  }

  collectionData.append(schema)

#print(collectionData)

df = pd.DataFrame(data = collectionData)
print("\n")
print(df)
print("\n")

gScope = ["https://spreadsheets.google.com/feeds","https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_dict(DROP_WAYSCRIPT_JSON_VARIABLE_HERE, gScope)
client = gspread.authorize(creds)
sheet = client.open("INSERT_SHEET_NAME").sheet1
set_with_dataframe(sheet, df)

print('--- Updated DB. ---')
