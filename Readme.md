# TweetTube Backend

This project is a backend implementation of a YouTube+Twitter-like application, developed as a learning exercise for advanced backend concepts.

## Learning Outcomes

Through this project, I gained hands-on experience with:

- Access tokens and refresh tokens for authentication
- Password hashing using bcrypt
- MongoDB database operations and aggregation pipelines
- Creating and organizing routes and controllers
- Implementing authentication and file upload (multer) middlewares
- Using Cloudinary for video file storage

## Acknowledgements

This project was taught by Mr. Hitesh Choudhary, who provided excellent guidance on:

- Setting up the project structure
- Explaining fundamental backend concepts
- Implementing the user controller as a reference
- Demonstrating the creation of middlewares, models, utils and routes
- how to test API endpoints using Postman

Following his instruction, I was tasked with independently developing all other controllers:
- Comment Controller
- Dashboard Controller
- Healthcheck Controller
- Like Controller   
- Playlist Controller
- Subscription Controller
- Tweet Controller
- Video Controller

Writing all these controllers significantly enhanced my understanding of backend development.

## 🌐 Important Links

| 📄 Content               | 🔗 Link                                                                 |
| -------------------------|------------------------------------------------------------------------|
| 🔴 Live Link             | [click here](https://tweet-tube-frontend.vercel.app/)                          |
| 📈 Model                 | [click here](https://app.eraser.io/workspace/cATefMPkrAdzR9c6teox?origin=share) |

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for file storage
- Bcrypt for password hashing

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## API Testing

You can test all the available API routes using Postman. I have created a Postman public workspace where you can easily import and test the routes without having to manually set up each endpoint.

Postman Workspace: https://www.postman.com/research-engineer-54415261/youtube-clone-backend

Simply click the link, and you'll be able to test the authentication, video upload, and other functionalities directly in Postman. Ensure that you set up the required environment variables in Postman for seamless testing.

## Project Structure

- `src/`: Source code
  - `controllers/`: Request handlers
  - `models/`: Database schemas
  - `routes/`: API routes
  - `middlewares/`: Custom middlewares
  - `utils/`: Utility functions
- `index.js`: Entry point

For more details, please refer to the source code and comments within each file.
