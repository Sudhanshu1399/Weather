import pymongo
import pandas as pd

# connect to MongoDB server
client = pymongo.MongoClient("mongodb://localhost:27017/")

# get reference to database
db = client["WeatherForecast"]

# get reference to collection
collection = db["collection1"]

# retrieve data from collection
result = collection.find()

# convert data to pandas DataFrame
df = pd.DataFrame(list(result))

# create Excel writer object
writer = pd.ExcelWriter("output.xlsx")

# write DataFrame to Excel sheet
df.to_excel(writer, index=False)

# save Excel file
writer._save()

print("Data stored in Excel file successfully.")
