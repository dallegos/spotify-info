import fetch from "node-fetch";
import { readFileSync } from "fs";

/**
 *
 * @param filename The template string to process should be located in the ./views folder
 * @param data The data to apply to the template
 * @returns The template with the applied data
 */
export function getTemplate<T>(filename: string, data?: T): string {
    let template = readFileSync(`./views/${filename}`, "utf8");

    // Process template with data
    if (data) {
        Object.entries(data).forEach(([key, value]): void => {
            template = template.replace(
                new RegExp(`{{ ${key} }}`, "g"),
                value as string
            );
        });
    }

    // Create bars
    const bars = Array.from({ length: 70 })
        .map(() => "<div></div>")
        .join("");
    template = template.replace("{{ bars }}", bars);

    return template;
}

/**
 * Downloads an image and returns it as an encoded base64 string
 * @param url The image URL to download
 * @returns The image encoded
 */
export async function downloadImage(url: string): Promise<string> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
}

/**
 * Escapes the string to make it safe for XML
 * @param string The string to scape
 * @returns The string scaped
 */
export function escapeXML(string: string) {
    return string.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
            default:
                return "";
        }
    });
}
