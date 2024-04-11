#!/bin/bash

# Define the image name
IMAGE_NAME="feliperomero/storageservice"

# Define the Dockerfile location
DOCKERFILE_PATH="."

# Check if the Docker image exists and remove it
if docker inspect $IMAGE_NAME > /dev/null 2>&1; then
    docker rmi -f $IMAGE_NAME
fi

# Build the Docker image
docker build -t $IMAGE_NAME $DOCKERFILE_PATH

# List all Docker images
docker image list
