# Coordinote

## Authors

Phillip Anerine, Aughdon Breslin, Daniel Craig, Jeremy Krugman

## Deployment: localhost

- Ensure `node` and `npm` are installed and up to date on your computer, and download the repository.
- In one terminal, navigate into the `coordinote/server/` directory. 
  - To install all of the modules and dependencies, type `npm i`
  - From here, typing in `npm run dev` runs the server with the ability to automatically reload when changes are made to the server files, and typing `npm start` runs the server without this ability.
  - While in this directory, typing `npm run seed` will populate the MongoDB with verified firebase users and make some starting events attached to the first user. 
- In another terminal, navigate into the `coordinote/client` directory.
  - Same as above, type `npm i` to install all of the required modules and dependencies.
  - Then, type `npm start` to launch the client.

## Deployment: AWS
- The application was deployed to an AWS EC2 instance. In order to deploy the application yourself, instead of running the client code with `npm start` you have to prepare the build files. 
- In a terminal navigate to the `coordinote/client` directory, and run `npm run build`. 
- Do not touch the file structure! The server is set up to serve the build files with a specific path. 
- Navigate to `coordinote/server` and run `npm start` (assuming you have run npm i as per the previous instructions)
- From here, running `npm run dev` or `npm start` (depending if you want the server to react to server file changes) will start the server. You
can see the web page in http://localhost:3001/ 
- This has been deployed in AWS on the link https://coordinote.us/

## Usage

- Navigate to `localhost:3000/` to be welcomed by our home page with a quick tutorial of how our site works!
- If you are not signed in, you will have the option to login with an account we seeded, or use the signup option to create your own. 
  - You will need to use an actual email so that you can receive verification. (Stevens Emails will not work, you might have to check your spam
  folder with another gmail)
- Once logged in, click on New Event to begin creating events, and use the event link to invite others!