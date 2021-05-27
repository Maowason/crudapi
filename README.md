## To Run the Docker Image<br/>
1. Go to [Docker Repo](https://hub.docker.com/r/maowason/crudapi)<br/>
2. Pull the docker image
3. Run the image (Read Below)

The Docker image requires 2 arguments (environment variables)<br/>
* Database URI<br/>
*  Token Secret Key<br/>

Example Snippet:<br/>
` docker run -p 9000:9000 -e DB_CONNECT="mongodb://localhost:27017" -e TOKEN_SECRET="insertSecretTokenHere" -dit maowason/crudapi:v1`<br/>
The Exposed port in the image is 9000.<br/>

## About the API:<br/>
The API has various routes. The main routes are <br/>
* /api - For all API related requests. It has various routes under it.
* /users - To Register new user and to login

## Schema
* Users Schema
```
name: {
  type: String,
  required: true
},
email: {
  type: String,
  required: true
},
password: {
  type: String,
  required: true,
  min: 6
},
date: {
  type: Date,
  default: Date.now()
}
```
* API Schema
```
device:{
    type: String,
    required: true
},
// To handle timestamp request coming from the uploaded csv datasets
t:{
   type: String,
   required: false
},
w:{
    type: Number,
    required: true
},
h:{
    type: String,
    required: true
 },
p1:{
    type: Number,
    required: true
 },
p25:{
    type: Number,
    required: true
},
p10:{
    type: Number,
    required: true
}
{ timestamps: true })
```
## How to use the API?
* The application has all calls authenticated using JWT. So thats why the user must first go to `https://<link>:<port>/users/register` and they can first do a POST request as shown in the sample snippet below:<br/>
```
{
    "name":"Mao",
    "email":"lel@gmail.com",
    "password":"password123"
}
```
Since the Application also checks for Validation, so the email should be of a valid format and password shall be minimum 6 characters long. If the email already exists in the database then a `400 Bad Request` will be returned.<br/>

* So once the user is registered they can go ahead and Login. Go to `https://<link>:<port>/users/login` and then do a POST request as shown in the sample snippet below:<br/>
```
{
    "email":"le@gmail.com",
    "password":"password123"
}
```
* Once the user logs in a Unique Authentication Token is returned which they can Add in the Header against a key called `auth-token` as shown below:<br/><br/> 
![image](https://user-images.githubusercontent.com/20398981/119907293-95c52d80-bf6d-11eb-9bc6-492e91256c77.png)

* Now once the user has successfully logged in they will be allowed to use the API service on the /api route.
* So to see all the devices they can perform a GET Request to `https://<link>:<port>/api/`
* To Add a single device they can perform a POST Request to `https://<link>:<port>/api/` and can send json as shown in the sample snippet below:<br/>
```
{
    "device":"DeviceA",
    "w":"3",
    "h":"SE",
    "p1":"23",
    "p25":"43",
    "p10":"32"
}
```
* Now to pull specific Data user can perform a GET Request to `https://<link>:<port>/api/<device_name>`, which will return the info about the devices sharing the device name passeed. Be careful - since the name field is case sensitive.<br/><br/>
![image](https://user-images.githubusercontent.com/20398981/119908003-38ca7700-bf6f-11eb-8cc6-5dc7503154e5.png)

* There is a route to pull pm1, pm2.5, and pm10 values separately for all specified device, the user can perform a GET Request to `https://<link>:<port>/api/<device_name>/<p1 or p25 or p10>/` This will return the ID of the Device and the pm value.<br/><br/>
![image](https://user-images.githubusercontent.com/20398981/119908253-cefe9d00-bf6f-11eb-87f2-cdf31379abfc.png)

* There is a route to filter data by a provided time range - For this the user must perform a GET Request to `https://<link>:<port>/api/date/<fromDate>/<toDate>/`<br/>
Note: This will not work for explicitly provided time (t). This will consider Date of when the device was posted to the Database. I'll be working on handling the explicitly provided time as well.<br/><br/>
![image](https://user-images.githubusercontent.com/20398981/119908940-58fb3580-bf71-11eb-8ee5-cbe90cd18766.png)

* There is also a route to upload bulk data from a CSV - For this the user must perform a POST request to `https://<link>:<port>/api/upload`. The user shall add a KEY called `file` and shall attach the csv they wish to push.<br/><br/>
![image](https://user-images.githubusercontent.com/20398981/119909324-33baf700-bf72-11eb-8842-43426915f388.png)
