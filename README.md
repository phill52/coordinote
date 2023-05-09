# Coordinote

## Authors

Phil Anerine, Aughdon Breslin, Daniel Craig, Jeremy Krugman

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

- Navigate to `https://coordinote.us/` to begin!

## Usage

- Navigate to `localhost:3000/` to be welcomed by our home page with a quick tutorial of how our site works!
- If you are not signed in, you will have the option to login with an account we seeded, or use the signup option to create your own. 
  - You will need to use an actual email so that you can receive verification.
- Once logged in, click on New Event to begin creating events, and use the event link to invite others!