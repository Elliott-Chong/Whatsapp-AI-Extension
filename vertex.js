const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

const PROJECT_ID = "roadsmart-1412";

const autoComplete = async (history, output_user) => {
  const auth = new GoogleAuth({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      token_url: process.env.GOOGLE_TOKEN_URL,
    },
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const token = await auth.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    instances: [
      {
        prompt: `
        you are an ai embedded in an AI powered chat app. I will pass you a context of the 20 latest messages of the chat labelled by who said it, and you will give me options on how to appropriately respond in the next message, provide 3 options, each option delimited by a line break character so that i can parse the options easily.

example:

Elliott: yo are you coming to the dinner tnight?\n
Sithu: where and when?\n
Timothy: hmm i need to check with my parents\n
Elliott: we're going to holland village for some drinks\n
Timothy:

output:
* I'll check with them and let you know
* Hmm I think i'll pass for tonight
* Alright let's go! I love holland village

be sure that the output is in the format of a bulleted list, and that the output is a string with the options delimited by a line break character.
there should not be backticks in the output, and the output should not be wrapped in a code block.

${history.map((h) => `${h.user}: ${h.text}`).join("\n")}
${output_user}:
        `,
      },
    ],
    parameters: {
      temperature: 1,
      maxOutputTokens: 256,
      topK: 40,
      topP: 0.95,
    },
  });

  try {
    const response = await axios.post(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/text-bison:predict`,
      body,
      {
        headers,
      }
    );

    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      console.error(response.data);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  autoComplete,
};
