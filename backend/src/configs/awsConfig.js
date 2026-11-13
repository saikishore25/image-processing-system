import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const s3 = new S3Client({
    region: process.env.AWS_REGION || "ap-south-2",
});

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "ap-south-2"
});

export const dynamodb = DynamoDBDocumentClient.from(client);

