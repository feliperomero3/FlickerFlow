#!/bin/bash

# Define the image name
IMAGE_NAME="flickerflow"

# Run the Docker container
docker run -d -p 3000:3000 -e DEBUG=* -e PORT=3000 $IMAGE_NAME

# List all Docker containers
docker container list
