#!/bin/bash

# Run the Docker container
docker run -d -p 3000:3000 -e DEBUG=* -e HOST=0.0.0.0 -e PORT=3000 flicker-flow

# List all Docker containers
docker container list
