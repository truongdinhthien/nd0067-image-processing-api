# Image Processing API

This project contributes to the curriculum of the Udacity Full-Stack JavaScript Nanodegree program.

This is a simple RESTful API for image processing generates a resized thumbnail version of each image and saves it to the disk (`thumb` folder). Additionally, it comes equipped with comprehensive testing capabilities to ensure reliability and robustness.

## Built with

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Jasmine**: Behavior-driven development (BDD) testing framework for JavaScript.
- **Sharp**: High-performance Node.js library for image processing

## Scripts

- Installation: To install dependencies, run `npm install`.
- Building: To build the project, execute `npm run build`.
- Linting: Run `npm run lint` to lint the project's codebase.
- Format: Use `npm run prettier` to format the project's codebase.
- Running Unit Tests: Execute `npm run test` to run unit tests for the project.
- Starting the Server: To start the server, run `npm run start`.

## Usage
1. Start the server (listen on port 3000)
2. Access the API endpoints to resize images and generate thumbnails.

### API Endpoints
- **GET /**: Redirect to the `/api`
- **GET /api**: Return the parsed README.md
- **GET /api/images?filename={filename}&width={width}&height={height}**: Return the resized thumb image with the dimension

### Testing
The API includes comprehensive testing features to ensure functionality and reliability. To run the tests, use the following command: 
```bash
 npm run test
```