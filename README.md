# FlickerFlow

Inspired by the book [Bootstrapping Microservices Second Edition][1] by Ashley Davis (Manning, 2024).

FlickerFlow is a simple video-streaming service that delivers video to a user watching in a web browser.

Our application will contain services for video streaming, storage, and upload, plus a gateway for the customer-facing frontend.
The users can view a list of videos and select one to begin playing it.

## Prerequisites

- Node.js 20
- Docker Desktop 4.28

## Getting started

1. Clone the repository.
1. Open a terminal in the root directory.
1. Change to the `src/video-service` directory.
1. Run `npm install`.
1. Run `npm start`.
1. Change to the `src/storage-service` directory.
1. Run `npm install`.
1. Run `npm start`.
1. Open your web browser at <http://localhost:3000>.

## Getting started using Docker Compose

1. Clone the repository.
1. Open a terminal in the root directory.
1. Change to the `src` directory.
1. Run `docker compose up --build`.
1. Open your web browser at <http://localhost:4000>.

## License

[MIT License](./LICENSE)

[1]: https://www.manning.com/books/bootstrapping-microservices-second-edition

## Appendix

The sample video we're using was downloaded from <https://sample-videos.com>.
