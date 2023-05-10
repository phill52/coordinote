# Coordinote

## Authors

Phillip Anerine, Aughdon Breslin, Daniel Craig, Jeremy Krugman

## Deployment: localhost

- Ensure `node` and `npm` are installed and up to date on your computer, and download the repository.
- For Image Magick, ensure that you have it installed. If you are running the server on Windows (Powershell, CMD), download and install Image Magick through this link before starting the express server: https://imagemagick.org/script/download.php#windows. Download and install the file linked under the first link under 'version'
Once you have this installed, restart your computer. We have had better luck with getting it to work on windows. We've tried with Linux, but it's complicated and does not work well with the other two. Effectively, Image Magick is OS dependent.
If you have a mac, install Image Magick with 'brew install imagemagick'
- You will need to install the node modules in the top level directory. Navigate to `coordinote/` and run `npm i`

For this next bullet, "I" will refer to Daniel
- For the client, I needed to change his package.json in the coordinote/client direcotry to include this:
  "options": {
    "allowedHosts": [
      "localhost",
      ".localhost"
    ],
    "proxy":"https://coordinote.us"
  },
  here, the proxy is inside of the options key. I need to do this to get my client to start. If I don't, I get some error with allowedHosts[0] being undefined when I start my react client. I had to change my client package.json options key to what is shown above for it to work. I think I was the only one in the group to need to make this change. You may not need to do it. You may need to change your client package.json to have
  
    "options": {
    "allowedHosts": [
      "localhost",
      ".localhost"
    ]
  },
    "proxy":"https://coordinote.us",

  instead, where the proxy key is outside of the options key. You may need to make this change.


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
