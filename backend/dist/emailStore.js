"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePDFs = savePDFs;
exports.getPDFs = getPDFs;
let pdfs = [];
function savePDFs(items) {
    pdfs = items;
}
function getPDFs() {
    return pdfs;
}
