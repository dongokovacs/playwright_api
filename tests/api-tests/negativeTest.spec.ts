import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expects';


[
    {username: 'dd', usernameErrorMessage: 'is too short (minimum is 3 characters)'},
    {username: 'ddd', usernameErrorMessage: ''},
    {username: 'llllllllllllllllllll', usernameErrorMessage: ''},
    {username: 'dddddddddddddddddddddddddddddd', usernameErrorMessage: 'is too long (maximum is 20 characters)'},

].forEach(({username, usernameErrorMessage}) => {

    test(`error message DDT validations for ${username}`, async ({api}) => { 

        const newUserResponse = await api
                                .path('/api/users')
                                .body({
                                    "user": {
                                        "email": 'd',
                                        "password": 'short',
                                        "username": username
                                    }
                                })
                                .clearAuth()
                                .postRequest(422);

        if(username.length == 3 || username.length == 20) {
            expect(newUserResponse.errors).not.toHaveProperty('username');
        }else{
            expect(newUserResponse.errors.username[0]).shouldEqual(usernameErrorMessage);
        }
    });
});