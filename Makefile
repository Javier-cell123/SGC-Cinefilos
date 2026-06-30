install:
	cd backend && npm install

run-backend:
	cd backend && npm run dev

lint:
	cd backend && npx eslint src/**/*.js

test:
	cd backend && npm run test

.PHONY: install run-backend lint test