# Video Sharing Service

A full-stack web application that allows users to share videos. This project includes several microservices for handling video uploads, processing, and playback, along with user management and authentication. This project is optimized for scalability, efficiency, and user experience.

**Features**
- User Authentication: Sign up and log in using Google accounts.
- Video Upload: Users can upload and delete videos which are processed for encoding and thumbnail generation.
- Video Playback: Video files are stored and streamed for smooth playback.
- Responsive Interface: Frontend designed for an engaging user experience.

**Project Structure**
- api-service: Handles the backend functionality, including user authentication, video metadata management, and user interactions.
- video-processing-service: Manages video encoding and thumbnail generation.
- web-client: Frontend interface for users to upload, view, and interact with videos.
- utils: Contains shared utility functions and resources used by multiple services.

**Tech Stack**
- Frontend: React, Next.js, TypeScript, CSS
- Backend: Node.js
- Video Processing: FFmpeg
- Database: Google Cloud, Firebase
- Containerization: Docker
- Authentication: JWT-based user authentication
