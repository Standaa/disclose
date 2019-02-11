# Disclose - NodeJS Authority server

This server represents the server of a fictional authority. It acts as a backend server for the [fictional authority's website](https://github.com/stanislasdrg/disclose/tree/dev/client). The server is responsible for verifying that the data and proof sent by a user are valid. If both are valid, part of the data sent by the user will be signed with the authority's server private key. Once signed, the data will be sent back to the user.

## Development server

Run `nodemon src/src.js` within server's the root folder for a dev server. Navigate to `http://localhost:3030/`. The app will automatically reload if you change any of the source files.
