#!/bin/bash

# Define the image name
IMAGE_NAME="feliperomero/flickerflow-storage"

# Run the Docker container
docker run -d -p 3001:3001 -e DEBUG=* -e PORT=3001 --name storage-service $IMAGE_NAME

# List all Docker containers
docker container list
