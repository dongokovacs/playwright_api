import { test as base } from "@playwright/test";
import { RequestHandler } from "./request-handler";
import { appendFileSync } from "node:fs";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expects";
import { config } from "../api-test.config";
import { createToken } from "../helpers/createToken";

export type TestOptions = {
    api: RequestHandler;
    config: typeof config;
};

//create new type for worker fixture
export type WorkerFixture = {
    authToken: string;
};

export const test = base.extend<TestOptions,  WorkerFixture>({

    //initial the beginning of everything else
    //run once per worker token once per run
    //worker fixture for automatic authorization
    //worker scope fixture
    authToken: [async ({}, use) =>{
        const authToken = await createToken(config.userEmail, config.userPassword);
        await use(authToken);
    }, {scope: 'worker'}],

    //normal, regular fixtures
    api: async ({request, authToken}, use) => {
        const logger = new APILogger()
        //it is an instance of the logger
        setCustomExpectLogger(logger)
        //create instance
        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken);  //beforetest
        await use(requestHandler);  //aftertest
    },
    config: async({}, use) => {
        await use(config)
    }
});



