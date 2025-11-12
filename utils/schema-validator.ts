import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true }); //additional formats
addFormats(ajv);
import {createSchema} from 'genson-js';

//const SCHEMA_BASE_PATH = path.resolve(__dirname, '..', 'schemas');
const SCHEMA_BASE_PATH = './response-schemas';


export async function validateSchema(dirName: string, fileName: string, responseBody: object, createShemaFlag: boolean=false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);
    console.log(`Validating schema at: ${schemaPath}`);
    //create schema or not
    if(createShemaFlag)
        await generateNewSchema(responseBody, schemaPath);
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);
    const valid = validate(responseBody)
    console.log(responseBody);
    if(!valid){
        throw new Error(`Schema validation ${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n` +
            `actual response body: \n` + `${JSON.stringify(responseBody, null, 4)}\n` +
            ajv.errorsText(validate.errors)
        );
    }
    //console.log(schema);
}

async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    } catch (error) {
        throw new Error(`Failed to load schema from ${schemaPath}: ${(error as Error).message}`);
    }
}

async function generateNewSchema(responseBody: object, schemaPath: string) {
    try {
            const generatedSchema = createSchema(responseBody);
            //if no folder create it
            await fs.mkdir(path.dirname(schemaPath), { recursive: true });
            await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4), 'utf-8');
            console.log(`Schema file created at: ${schemaPath}`);
        } catch (error) {
            throw new Error(`Failed to create schema file: ${(error as Error).message}`);
        }
}

