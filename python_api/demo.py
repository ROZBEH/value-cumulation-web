from gpt_index import GPTPineconeIndex, SimpleDirectoryReader
import pinecone
import os
from dotenv import load_dotenv
from sec_api import QueryApi, XbrlApi, ExtractorApi
import json


# Load the API keys
load_dotenv()
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
SEC_API_KEY = os.getenv('SEC_API_KEY')


# 10-K HTM File URL example
# extractor = ExtractorApi(api_key=SEC_API_KEY)
# filing_url_10k = "https://www.sec.gov/Archives/edgar/data/78003/000007800321000038/pfe-20201231.htm"
# # Supported sections are the followings:
# sections = ['1', '1A', '1B', '2', '3', '4', '5', '6', '7', '7A',
#             '8', '9', '9A', '9B', '9C', '10', '11', '12', '13', '14', '15']
# all_sections_texts = ''
# for section in sections:
#     response = extractor.get_section(filing_url_10k, section, 'text')
#     all_sections_texts += "\n" + response
# print('Print all the text = ')
# # print(all_sections_texts)
# with open('data/10k-Pfizer.txt', 'w') as f:
#     f.write(all_sections_texts)


documents = SimpleDirectoryReader('data/10KData').load_data()
pinecone.init(api_key=PINECONE_API_KEY, environment="us-west1-gcp")
print(pinecone.list_indexes())
# staring an instance if it already doesn't exist
# pinecone.create_index("quickstart", dimension=1536,
#                       metric="euclidean", pod_type="p1")
index = pinecone.Index("quickstart")
index = GPTPineconeIndex(documents, pinecone_index=index)
# try verbose=True for more detailed outputs
response = index.query(
    "What are the company's goals for the next fiscal year?", verbose=True)
print("response = \n", response)
