# Automation Testing for a Full-Stack To-Do Application

## 🎯 Objective

This project's main goal is to validate the end-to-end functionality of a to-do web application by automating tests for both the UI (React frontend) and the API (Node.js backend). The testing framework uses **Playwright** for the user interface and **Postman/Newman** for the API.

***

## ✅ Prerequisites

Before running the tests, ensure you have the basic to-do application running.

* Clone this repository where your playwright is configured.
* Create the following folder structure:
  - app
    - frontend
    - backend
* Navigate to the `app/frontend/` directory.
* Run the cpmmand:
```bash
npx create-react-app .
```
* Navigate to the `app/frontend/src/` directory.
* Replace the `App.js` file with the `App.js` file present in `BasicToDoApp/todo/`.
* Navigate to the `app/backend/` directory.
* Copy and paste the `index.js` file present in `BasicToDoApp/Server/`.
* Run the commands:
```bash
npm -init y
npm install express cors jsonwebtoken bcryptjs
```
* Delete the `BasicToDoApp` directory.
* Navigate to the `app/frontend/` directory.
* Run the command to start the frontend:
```bash
npm start
```
* Navigate to the `app/backend/` directory.
* Run the command to start backend:
```bash
node index.js
```

***

## 🧪 Test Strategy Overview

The testing scope covers UI and API automation, including positive and negative scenarios and data-driven testing. Performance testing and cross-browser compatibility are out of scope.

### UI Testing (Playwright)

* **Purpose**: To simulate user behavior in a browser.
* **Test Scenarios**:
    * Valid and invalid user signup.
    * Valid and invalid user login.
    * Create, Read, Update, and Delete (CRUD) operations for to-do items.

### API Testing (Postman)

* **Purpose**: To validate the backend endpoints.
* **Test Scenarios**:
    * `POST /signup`: Verify user creation and check for errors on duplicates.
    * `POST /login`: Validate successful login (Status=`200`), token validation, and invalid login attempts.
    * `GET /items`: Verify the retrieval of existing to-do items.
    * `POST /items`: Test adding a new item with both valid and invalid data.
    * `PUT /items/:id`: Check the editing of an item's text.
    * `DELETE /items/:id`: Validate the success message and status for item deletion and invalid id.

***

## 🚀 Executing the Tests

*  Store the Env Variables from `.env` file in the Postman Enviornment.
*  Navigate to the `tests/` directory.
*  Run the command:

```bash
npx playwright test tests/client.spec.ts --headed --project=chromium
```

* For checking the reports, run the command:

```bash
npx playwright show-report
```
