
# Authorization - File Management
**Author**: Sarah Bixler  
**Version**: 1.0.3  

### Overview
This application enables users to make  __CRUD__ requests to a __RESTful API__ accessible database, that requires login information (username, email, tokenSeed) to be accessed.  The login and signup routes will have basic security features-- the user's password will be immediately hashed by __bCrpyt__ and will never be stored in its original form. A tokenSeed and token will be generated, that will authorize the user to perform __CRUD__ operations on a dependant resource.  the user will stau authorized for the duration of their token.
 
For now the main entry point is via the testing files:
1. open two tabs in your CLI/terminal
2. in one type: __npm run dbon__, which will start the Mongo database
3. in the other: __npm run test__, which will run the testing suite

### API routes and DB Schemas
__Account Schema__  
The __POST__ route to api/signup and the __GET__ route to api/login
http://localhost:3000/api/signup?username==_'blahblah'_ email==_'blah@blah.com'_ password==_'blah123'_
http://localhost:3000/api/login?username=_'blahblah'_ password=_'blah123'_

__Profile Schema__  
The __POST__ and __GET__ routes to api/profiles

http://localhost:3000/api/profiles/post?firstname==_'anna'_ lastname==_'smith'_ __OPTIONAL:__ _bio==_ 'grew up in southern indiana' _avatar_== 'selfie.jpg'_   
the __GET ROUTE:__ http://localhost:3000/api/profiles/:id

__Asset Schema__  
The __POST__ , __GET__ and __DELETE__ routes to api/assets/:id
they perform CRUD operations on an external file storing service, while storing meta information about the file in a locally stored MongoDB
## Successful Requests and Error Handling
successful requests to POST and GET return 200, DELETE returns 204  
unsuccessful requests to POST, GET and DELETE include:  
404 - file not found / wrong id, 401 - not authorized


#### Proof of External Post
![proof](./src/assets/proof.png) 

### Architecture
This application uses the __Node.js__ framework.  
__MongoDB__ is used for the database  
__mongoose__ is used to make javascript syntactical requests to the Mongo DataBase  
__express__ is used for routing  
__JSON Web Token__  is used for the encryption alogrithm, _npm i jsonwebtoken_  
__bCrypt__ is used for the hashing algorithm, _npm i bcrypt_  
__superagent__ parses JSON into query strings to make requests to the api in testing
__bodyParser__ re-parses api requests server side, turning the query string back into JSON 
__logger__ tracks and stores console logs  
__faker__ is used in testing to generate random strings  
__jest__ is the testing suite
__AWS__ is used for offsite storage
__multer__ is helping with the uploads

### Change Log
05-07-2018 9:00am - Application now has a fully-functional account schema with password HASH and encryption for user authentication, as well as a restful POST route with tests
05-08-2018 9:00am - Application now has a fully-functional secondary schema, profile, attached to the account schema, GET and POST routes functional
05-10-2018 9:00am - Application now has a fully-functional tertiary schema, that links to the account schema for authorization, and POSTs, GETs and DELETEs from an AWS bucket

