import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

//const SCHEMA_BASE_PATH = path.resolve(__dirname, '..', 'schemas');
const SCHEMA_BASE_PATH = './response-schemas';


export async function validateSchema(dirName: string, fileName: string, responseBody: object) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);
    const valid = validate(responseBody)
    if(!valid){
        throw new Error(`Schema validation ${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n` +
            //`actual response body: \n` + `${JSON.stringify(responseBody, null, 4)}\n` +
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

