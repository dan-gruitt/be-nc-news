# 📰 Northcoders News API

Welcome to my Northcoders backend project. This the backend portion of the final app. Here you will find all the information you need to get the app up and running. 

You can find a live version [here](https://nc-news-backend-project-dan-gruitt.onrender.com/api). <br>
(This will default to the available endpoints and what you can expect to find at them)

# Available Endpoints

## GET

### 🚑  /api/healthCheck
Check the health of the connection

### 💭 /api/topics
Provides an array of all the topics

### 📑  /api/articles
Provides an array of articles

### 🧑‍🤝‍🧑  /api/users
Provides an array of all users

### 📕  /api/articles/:article_id
Provides a single article when provided a valid comment_id

### 💬  /api/articles/:article_id/comments
Provides all comments associated with the provided article_id

## POST

### 💌  /api/articles/:article_id/comments
Allows the user to post new comment. <br>
Post object format:

```
{
    username: "inputtedUserName"
    body: "Sample body
}
```

## PATCH

### 💌  /api/articles/:article_id
Allows the user to increment comment votes to the inputted article_id<br>
Patch object format:

```
{
    inc_votes : 1
}
```

## DELETE

### 💌  /api/articles/:article_id
Allows the user to delete the article at inputted article_id<br>
Please note, no response will be given except the appropriate status code.




# Setup

## Local Setup

### Step 1 - Clone the repo

First you need to clone the rep down to your own device. To do this open your terminal and navigate to where you would like to store the project. Then enter the following command:<br>

```
git clone https://github.com/dan-gruitt/be-nc-news.git
```

### Step 2 - Install the dependencies

### 👉 [dotenv](https://www.npmjs.com/package/dotenv)

### 👉 [express](https://expressjs.com/en/starter/installing.html)

### 👉 [supertest](https://www.npmjs.com/package/supertest)

### 👉 [pg-format](https://www.npmjs.com/package/pg-format)


## Step 3 - Seeding

To seed the database run the below command in the command line

```
npm run seed
```

## Step 4 - Environment Variables

You will need to create the following three files installed in the root directory

## .env.development  
this file should contain the following line:
    
```   
PGDATABASE=nc_news; 
```
## .env.test
this file should contain the following line:
    
```
PGDATABASE=nc_news_test;
```    

### .env.production
this file should contain the following line:
    
```
DATABASE_URL=<URL>
```


