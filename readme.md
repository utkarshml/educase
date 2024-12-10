# Educase

Educase is a school management system built with Node.js, Express, and Sequelize. It provides a RESTful API for managing schools and their information, including functionalities to add, list, and validate school data.

## Features

- Add a new school with validation for duplicate entries and invalid data.
- List schools sorted by their distance from a given latitude and longitude.
- Error handling for failed operations and invalid input.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for interacting with the MySQL database.
- **Jest**: Testing framework for unit and integration tests.
- **Supertest**: Library for testing HTTP endpoints.

## Project Structure

- `src/`: Contains the source code for the application.
  - `config/`: Configuration files for database connections.
  - `controller/`: Controllers for handling API requests.
  - `model/`: Sequelize models defining the database schema.
  - `test/`: Unit and integration tests for the application.

## Getting Started

### Prerequisites

- Node.js >= 12.x
- MySQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/educase.git
   cd educase
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory based on `.env.example`:

   ```plaintext
   DB_HOST=localhost
   DB_USER="admin"
   DB_PASSWORD="password"
   DB_NAME=school_management
   PORT=4000
   DB_PORT=3306
   ```

4. Run the database migrations (if applicable).

### Running the Application

- Start the development server:

  ```bash
  npm run dev
  ```

- Build the project:

  ```bash
  npm run build
  ```

- Start the production server:

  ```bash
  npm start
  ```

### Running Tests

- Run all tests using Jest:

  ```bash
  npm test
  ```

## API Endpoints

- **POST /addSchool**: Add a new school.
- **GET /listSchools**: List schools sorted by distance.

## License

This project is licensed under the ISC License.

## Contact

For any inquiries, please contact utkarshjais8957@gmail.com.
