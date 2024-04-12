#!/bin/bash

# Define the image name
IMAGE_NAME="feliperomero/flickerflow-video"

# Run the Docker container
docker run -d -p 3000:3000 -e DEBUG=* -e PORT=3000 --name video-service $IMAGE_NAME

# List all Docker containers
docker container list
