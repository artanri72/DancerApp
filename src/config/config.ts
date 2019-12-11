export interface ApplicationConfig {
    appName: string;
    apiEndpoint: string;
    production: boolean;
}

var APP_ENDPOINT = "http://192.168.31.13:3005/";

// configration values for our app
export const CONFIG: ApplicationConfig = {
    production: false,
    appName: 'DancersQ',
    apiEndpoint: APP_ENDPOINT
}
