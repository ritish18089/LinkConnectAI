import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function test() {
    try {
        console.log("pdfjsLib:", Object.keys(pdfjsLib));
    } catch (e) {
        console.error(e);
    }
}
test();
