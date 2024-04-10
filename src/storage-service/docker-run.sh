#!/bin/bash

# Define the image name
IMAGE_NAME="storageservice"

# Run the Docker container
docker run -d -p 3001:3001 -e DEBUG=* -e PORT=3001 $IMAGE_NAME

# List all Docker containers
docker container list
