.PHONY: help
SHELL := /bin/bash

build:
	docker compose build

start:
	[ -f frontend/.env ] || cp frontend/.env.sample frontend/.env && \
  [ -f backend/.env ] || cp backend/.env.sample backend/.env && \
  docker compose up
