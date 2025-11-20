
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '.env')});

/*
change environment with cmd
set TEST_ENV=prod && npm run apitest
*/
const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log('Test environment is: ' + env)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com',
    userEmail: 'kovacsdani04@gmail.com',
    userPassword: '19900604'
}

if(env === 'qa'){
    config.userEmail = 'pwtest@test.com',
    config.userPassword = 'Welcome2'
}
if(env === 'prod'){
    config.userEmail = process.env.PROD_USERNAME as string,
    config.userPassword = process.env.PROD_PASSWORD as string
}


export {config}