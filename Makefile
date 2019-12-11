enis:
	sed -i '' 's/APP_ENDPOINT = "http:\/\/dev.dancersq.com:3005\/"/APP_ENDPOINT = "http:\/\/192.168.31.13:3005\/"/g' ./src/config/config.ts
	sed -i '' 's/APP_ENDPOINT = "http:\/\/mobile-api.dancersq.com\/"/APP_ENDPOINT = "http:\/\/192.168.31.13:3005\/"/g' ./src/config/config.ts
	sed -i '' 's/production: true/production: false/g' ./src/config/config.ts
dev:
	sed -i '' 's/APP_ENDPOINT = "http:\/\/mobile-api.dancersq.com\/"/APP_ENDPOINT = "http:\/\/dev.dancersq.com:3005\/"/g' ./src/config/config.ts
	sed -i '' 's/APP_ENDPOINT = "http:\/\/192.168.31.13:3005\/"/APP_ENDPOINT = "http:\/\/dev.dancersq.com:3005\/"/g' ./src/config/config.ts
	sed -i '' 's/production: true/production: false/g' ./src/config/config.ts
prod:
	sed -i '' 's/APP_ENDPOINT = "http:\/\/dev.dancersq.com:3005\/"/APP_ENDPOINT = "http:\/\/mobile-api.dancersq.com\/"/g' ./src/config/config.ts
	sed -i '' 's/APP_ENDPOINT = "http:\/\/192.168.31.13:3005\/"/APP_ENDPOINT = "http:\/\/mobile-api.dancersq.com\/"/g' ./src/config/config.ts
	sed -i '' 's/production: false/production: true/g' ./src/config/config.ts
