# Disclose

This is the client side demo of Disclose. On this SPA, a user submits his credentials to an authority he can trust.
He computes a zk-proof of his informations and submits it to the authority. The authority then checks for the validity of all
parameters received and signs part of the data, before sending it back to the user.
s
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Notes

In this demo, the project runs on the UI thread. Zk-proofs being resource intensive, the UI animations sometimes hangs. I have tried to implement webworkers, but a webpack issue with CLI 7 prevented me from pushing the code.
