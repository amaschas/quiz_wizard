.PHONY: help
SHELL := /bin/bash

build:
	docker compose build

start:
	[ -f .env ] || cp .env-example .env && docker compose up

shell:
	docker compose run --rm app sh