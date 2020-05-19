#!/usr/bin/env bash

docker run -d --rm --name memory-postgres \
  -p 5432:5432 -v $PWD/postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=6P6R6ZseFutKG6y8 \
  -e POSTGRES_USER=postgres \
  postgres
