
# Masha - Personalised Discord GPT AI 

Scalable for thousands of server owners to personalise their own GPT chat bot in their servers that can react to users messages like a human, add emojis to messages, make comments on images users send to it, and other autogpt-like functionality for Discord.


## Features

- Customize context & rules for the AI
- Reacts to users messages with relevant emojis
- Reply to images sent to the AI, along with questions asked about it
- Full GPT3/GPT4 capabilities, must supply your own OpenAI API key 


## Installation

Download the source code

Copy the .env.template into its own .env file and fill out the required variables,
you'll need a MySQL server for the database_url


```bash
  npm install
  npm install nodemon -g
  npm prisma generate # May not be necessary
  npm run start
```
    

## Related

This project was made with Trident.JS (Developed by me), a discord bot framework

[Trident.JS](https://github.com/Velozity/trident.js)


## License

[MIT](https://choosealicense.com/licenses/mit/)

