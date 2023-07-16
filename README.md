# Whatsapp-AI-Extension
Chrome extension that uses google's Vertex AI to give you AI auto completion for your texts in whatsapp web :)

Video link: https://www.youtube.com/watch?v=4d855aFlUIc

To use this extension, first copy the `.env.example` file and rename it to `.env`

You have to log into google cloud console and enable the 'Google Vertex API' under the credentials and create a new API key. 
Download the JSON file for the API key and fill in the necessary fields in the .env file

Once you have done that, install the necessary dependencies for the project by running `npm install` at the root of the project.

Run `node server.js` to start up the backend which will handle the actual AI API call to vertex

Now you may head into your chrome browser and go to the url `chrome://extensions`. Click on the 'Load unpacked' button and choose the project directory.
This will load in the extension locally into chrome. Now you may head into your extensions list and you will find the extension.

You will have to click on the extension once everytime you enter whatsapp web in order to trigger the button to show up under the text input
