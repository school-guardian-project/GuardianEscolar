# School Guardian — Frontend

School Guardian is a school transportation and student safety platform. This repository contains the frontend clients: an Angular web application for school staff and administrators, and a React Native / Expo mobile application for parents, students, drivers, and guardians, plus a local Docker Compose stack for running the web frontend.

## Getting Started

These instructions will give you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on deploying the project on a live system.

### Prerequisites

Requirements for the software and other tools to build, test and push:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/)

### Installing

A step by step series of examples that tell you how to get a development environment running.

Clone the repository:

    git clone https://github.com/school-guardian-project/GuardianEscolar.git

Start the web frontend locally with Docker Compose:

    docker compose up -d

The Angular dev server is exposed on port `4200` with live-reload volume mounts for `src`, `public`, and `.env`.

Stop the stack:

    docker compose down

## Running the tests

Explain how to run the automated tests for this system.

### Mobile

From `dvlp-front/dlvp-movil/guardian-escolar/`, run:

    npm test

These tests cover component and hook regressions. Device behavior and access to deployed services require runtime verification; tests do not certify native rendering.

### Web

Follow the testing instructions in `dvlp-front/dlvp-web/`.

## Deployment

Add additional notes to deploy this on a live system.

### Web

The Angular web application is deployed to **Vercel**. The `vercel.json` configuration file under `dvlp-front/dlvp-web/` defines the build and routing settings for the production deployment. Pushing changes to the configured branch triggers an automatic rebuild and deployment on Vercel.

## Built With

- [Angular](https://angular.io/) — Web frontend framework
- [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) — Mobile application framework
- [Docker](https://www.docker.com/) / [Docker Compose](https://docs.docker.com/compose/) — Local development stack

## Contributing

Pending — to be defined.

## Versioning

Pending — to be defined.

## Authors

Pending — to be defined.

## License

Pending — to be defined.

## Acknowledgments

Pending — to be defined.
