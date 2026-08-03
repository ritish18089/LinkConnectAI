import fs from 'fs';
import path from 'path';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

export async function parseResume(filePath: string, originalName: string, reqId: string = 'SYS'): Promise<string> {
    const ext = path.extname(originalName).toLowerCase();
    
    if (ext === '.pdf') {
        console.log(`[REQ: ${reqId}] Parsing method: pdfjs-dist`);
        const dataBuffer = fs.readFileSync(filePath);
        const dataArray = new Uint8Array(dataBuffer);
        
        const loadingTask = pdfjsLib.getDocument({ data: dataArray });
        const pdf = await loadingTask.promise;
        
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        return text.trim();
    } else if (ext === '.docx') {
        console.log(`[REQ: ${reqId}] Parsing method: mammoth`);
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value.trim();
    } else if (ext === '.txt') {
        console.log(`[REQ: ${reqId}] Parsing method: txt utf-8`);
        return fs.readFileSync(filePath, 'utf-8').trim();
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        console.log(`[REQ: ${reqId}] Parsing method: Tesseract.js OCR`);
        const result = await Tesseract.recognize(filePath, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text' && Math.round(m.progress * 100) % 20 === 0) {
                    console.log(`[REQ: ${reqId}] OCR Progress: ${Math.round(m.progress * 100)}%`);
                }
            }
        });
        return result.data.text.trim();
    }
    
    throw new Error(`Unsupported extension: ${ext}`);
}
