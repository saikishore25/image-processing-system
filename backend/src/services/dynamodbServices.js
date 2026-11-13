import {
    PutCommand,
    GetCommand,
    ScanCommand,
    UpdateCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../configs/awsConfig.js";

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const saveImage = async (image) => {
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: image
    });

    await dynamodb.send(command);
};


export const getImage = async (imageId) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { imageId }
    });

    const result = await dynamodb.send(command);

    return result.Item || null;
};


export const getImages = async () => {
    const command = new ScanCommand({
        TableName: TABLE_NAME
    });

    const result = await dynamodb.send(command);

    return result.Items || [];
};


export const updateImage = async (imageId, updates) => {
    const entries = Object.entries(updates);

    const names = {};
    const values = {};

    const updateExpressions = entries.map(([key, value], index) => {
        names[`#field${index}`] = key;
        values[`:value${index}`] = value;

        return `#field${index} = :value${index}`;
    });

    names["#updatedAt"] = "updatedAt";
    values[":updatedAt"] = new Date().toISOString();

    updateExpressions.push("#updatedAt = :updatedAt");

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { imageId },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW"
    });

    const result = await dynamodb.send(command);

    return result.Attributes;
};


export const deleteImageRecord = async (imageId) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { imageId }
    });

    await dynamodb.send(command);
};
