/*
change environment with cmd
set TEST_ENV=dev && npx playwright test
*/
const processENV = process.env.TEST_ENV
const env = processENV || 'prod'
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
    config.userEmail = 'kovacsdani04@gmail.com',
    config.userPassword = '19900604'
}


export {config}