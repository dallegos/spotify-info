import fetch from "node-fetch";
import { readFileSync } from "fs";

export function getTemplate(filename: string, info: any) {
    let template = readFileSync(`./views/${filename}`, "utf8");

    Object.entries(info).forEach((entry) => {
        template = template.replaceAll(`{{ ${entry[0]} }}`, entry[1] as string);
    });

    return template;
}

export async function downloadImage(path: string): Promise<string> {
    const response = await fetch(path);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
}
