import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";
import { APILogger } from "../utils/logger";
import { request } from "@playwright/test";


export async function createToken(email: string, password: string) {
    //create a new request context independetly from the test
    //because this is a helper function
    //we do not have the request object here
    const context = await request.newContext()
    //i need these in this function
    const logger = new APILogger()
    const api = new RequestHandler(context, config.apiUrl, logger)

    try {
        const tokenResponse = await api
        .path('/api/users/login')
        .body({ "user": { "email": email, "password": password } })
        .postRequest(200)
    return 'Token ' + tokenResponse.user.token
    } catch(error) {
        Error.captureStackTrace(error as Error, createToken)
        throw error
    } finally {
        await context.dispose()
    }
    
}