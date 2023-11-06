Node.js Express REST API

This is a Node.js Express REST API that provides CRUD (Create, Read, Update, Delete) operations for managing data
resources over HTTP. It uses a MongoDB database to store data and is designed to follow RESTful architecture principles.
Getting Started
Prerequisites

To run this API, you'll need to have the following software installed:

    Node.js (v14 or later)
    MongoDB (v4 or later)

Installing

    Clone this repository to your local machine.
    Run npm install to install the project dependencies.
    Create a .env file (or use the existing one) in the root directory with the following variables:

makefile

PORT=<port_number>
MONGO_URL=<mongodb_uri>
JWT_SECRET=<jwt>
JWT_EXPIRES_IN=<jwt_validity>
ACTIVE_PROFILES=<profiles>

    Replace <port_number> with the port number you want the server to listen on (e.g. 3000). Default value is 3001.
    Replace <mongodb_uri> with the URI of your MongoDB database (e.g. mongodb://localhost/mydatabase).Default is cloud mongo of PN.
    Replace <jwt> with desired secret.
    Replace <jwt_validity> with desired validity. Without timeUnit treated as seconds. Else e.g. 99d or 1d12h30m. Else new Date('2023-06-01T00:00:00.000Z').
    Replace <profiles> with one or any of: purgeAll purgeAnimalKinds purgeUsers loadAnimalKinds createUsers. Database will be purged/populated on startup.

Running

    Run npm start to start the server from API directory
    If npm start does not work run "node index.js"
    Use a tool like Postman/Insomnia to interact with the API.

API Reference

The API has the following routes for backend:

    GET /api/v1/resources: Retrieves a list of all resources.
    GET /api/v1/resources/:id: Retrieves a single resource by ID.
    POST /api/v1/resources: Creates a new resource.
    PUT /api/v1/resources/:id: Updates an existing resource by ID.
    DELETE /api/v1/resources/:id: Deletes a resource by ID.
    PATCH /api/v1/resources/:id?parameter=newValue Patches resource by ID per request parameters.

Nested routes of depth 1, the API has the following nested routes for backend:

    not implemented yet, to do....

For RequestBodies consult dtoin folder

Authentication and Authorization:
Authentication: The process of verifying the identity of a user or system.

    User registration: Users can register by sending a POST /api/v1/users. Password is hashed and stored securely in the database.
    
    Authentication & User login: Users can login by sending a POST /api/v1/auth/login. Returned body has key "token". Use the token in Authorization header with "Bearer" prefix.
    The server verifies the token by checking its signature and expiration date.

    Authorization: The process of granting or denying access to resources based on the user's role or permissions. Current all resource endpoints under /api/v1 are accessible for "ROLE_ADMIN" only.
    Edit the accessibility based on your use case.

    User roles: Each user can have one or more roles, such as 'ROLE_ADMIN', 'ROLE_USER'.
    
    Custom access control: consult relevant route settings e.g. Last parameter goes to controller, before are access controls
        router.route("/:id")
                .get(protectWithAuthenticationToken, adminOrOwnerAccessOrThrow, getUser)
                .delete(protectWithAuthenticationToken, adminAccessOrThrow, deleteUser)
                .put(protectWithAuthenticationToken, adminOrOwnerAccessOrThrow, adminifyThrow, putUser);

The API has the following routes for frontend:

    not yest implement, but will be like so: app.use("/fe/v1/XXX", XXX);

Built With

    Node.js
    Express
    MongoDB

License

This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

    Express documentation
    Mongoose documentation
    RESTful API design guidelines

API Query Parameters

    This API allows you to use query parameters to perform advanced queries. The following query parameters can be used:

    page: Specifies the page number to retrieve. Default is 1. This parameter is used to perform pagination.
    limit: Specifies the number of results per page. Default is 30. This parameter is used to perform pagination.
    sort: Specifies the fields to sort the results by, separated by commas. To sort in descending order, add a "-" before the field name. For example, to sort by the "username" field in descending order, use "-username".
    fields: Specifies the fields to include in the response, separated by commas.
    numericFilters: Specifies numeric filters to apply to the query. For example, to filter by all users with a "age" field greater than or equal to 30, use "numericFilters=age>=30".
    populate: Specifies which embedded objects you wish to read with all available parameters. If not specified, embedded objects will be returned with id only. Split multiple values of embedding with dot (.), separate with comma (,).Example: populate=referencedCollection
