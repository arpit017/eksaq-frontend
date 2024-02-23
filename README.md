
This project is an example of a Node.js server that allows users to upload audio files.

Here is the link of backend repo - https://github.com/arpit017/eksaq-backend

You can got the deployed link and start recording your audio. it will be automatically uploaded on cloud and saved. You can also see previous recordings.
Please put in your name/topic before starting recording.



## Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDb
- Express.js
- Openai
- Aws-sdk


## Client
The client folder contains all of the frontend code for our web application. It was built using React and Chakra Ui.

- Chakra Ui
- React


## Dependencies

- `express`: Web framework for Node.js
- `multer`: Middleware for handling file uploads
- `aws-sdk`: AWS SDK for interacting with S3
- `openai`: OpenAI API wrapper for Node.js
- `dotenv`: Load environment variables from a `.env` file



## Notes

- Adjust the AWS S3 bucket name and region in the `.env` file (`AWS_BUCKET_NAME`, `AWS_REGION`).
- Replace `your_openai_api_key` with your actual OpenAI API key.
- This is a basic example and may require further configuration and error handling for production use.
