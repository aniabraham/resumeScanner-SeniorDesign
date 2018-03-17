# resumeScanner-SeniorDesign

Quick guide:

1) Download/clone this repository

2) In the terminal, navigate to the resumescanner folder,
   it should look like this: `C:\Users\aFolder\anotherFolder\resumeScanner-SeniorDesign\resumescanner`

3) in the terminal type in: `npm start`

4) In your browser go to localhost:3000
   It should say something along the line of "Welcome to Resume Scanner"
   

Database guide:

First you'll want to download the MongoDB Community Server. It makes it easier to look at the data in the database AND easy to manually insert data if we haven't created a connection from the website to the database yet.

Community Server (Compass): https://www.mongodb.com/download-center#community

Once you've done the Compass installation and opened up Compass, the server will ask you to connect to a host. Simply copy the URI below and then click into the server window. A pop-up will appear asking if it can autofill the the form with the uri you have copied. Say yes. Notice that username box is filled with "scanner", this also happens to be the password so be sure to put the password in as well. At the bottom there is an option to make this a favorite so fill the Favorite Name textbox with whatever you want and then click create favorite (no need to copy the URI all the time) then click connect. Now your connected to the database!

resumescanner URI: `mongodb://scanner:@cluster0-shard-00-00-yfeoh.mongodb.net:27017,cluster0-shard-00-01-yfeoh.mongodb.net:27017,cluster0-shard-00-02-yfeoh.mongodb.net:27017/admin?replicaSet=Cluster0-shard-0&ssl=true`

MongoDB			Normal DB
Database		Database
Collections		Tables
Documents		Data

Some things we need to change:
		- Switch Jade to HTML
		- Put the URI into the website and start a connection between the website and database
		- Create some diagrams as to how we are going to set up the DB
			- Will we stick to user login? Also should data be deleted after a certain time? ***This DB I made is the free option on MongoDB that has 512 MB of data to use. So it will run out of space if things aren't deleted.*** 