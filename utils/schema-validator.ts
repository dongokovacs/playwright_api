import fs from 'fs/promises';
import path from 'path';
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

//const SCHEMA_BASE_PATH = path.resolve(__dirname, '..', 'schemas');
const SCHEMA_BASE_PATH = './response-schemas';


export async function validateSchema(dirName: string, filName: string) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${filName}_schema.json`);
    const schema = await loadSchema(schemaPath);
    console.log(schema);
}

async function loadSchema(schemaPath: string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaContent);
    } catch (error) {
        throw new Error(`Failed to load schema from ${schemaPath}: ${(error as Error).message}`);
    }
}

