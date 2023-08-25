const fs = require('fs');
const esprima = require('esprima');

function tokenizeFromAST(ast) {
    return ast.tokens.map(token => token.value);
}

function kgrams(tokens, k) {
    const kGrams = [];
    for (let i = 0; i <= tokens.length - k; i++) {
        kGrams.push(tokens.slice(i, i + k));
    }
    return kGrams;
}

function hashKgram(kgram) {
    let hash = 0;
    for (const token of kgram) {
        for (let i = 0; i < token.length; i++) {
            char = token.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
    }
    return hash;
}

function winnow(hashes, w) {
    const fingerprints = new Set();
    for (let i = 0; i <= hashes.length - w; i++) {
        const window = hashes.slice(i, i + w);
        fingerprints.add(Math.min(...window));
    }
    return fingerprints;
}

function generateAST(code) {
    return esprima.parse(code, { tolerant: true, tokens: true });
}

function compareFingerprints(fingerprints1, fingerprints2) {
    const intersection = [...fingerprints1].filter(f => fingerprints2.has(f));
    const union = new Set([...fingerprints1, ...fingerprints2]);
    return intersection.length / union.size;
}

function plagiarismScore(file1, file2, k = 1, w = 1) {
    const code1 = fs.readFileSync(file1, 'utf8');
    const code2 = fs.readFileSync(file2, 'utf8');

    console.log('Original Code from File1:', code1);
    console.log('Original Code from File2:', code2);

    const ast1 = generateAST(code1);
    const ast2 = generateAST(code2);

    const tokens1 = tokenizeFromAST(ast1);
    const tokens2 = tokenizeFromAST(ast2);

    console.log('Tokens from File1:', tokens1);
    console.log('Tokens from File2:', tokens2);

    const hashes1 = kgrams(tokens1, k).map(kgram => hashKgram(kgram));
    const hashes2 = kgrams(tokens2, k).map(kgram => hashKgram(kgram));

    console.log('Hashes from File1:', hashes1);
    console.log('Hashes from File2:', hashes2);

    const fingerprints1 = winnow(hashes1, w);
    const fingerprints2 = winnow(hashes2, w);

    console.log('Fingerprints from File1:', [...fingerprints1]);
    console.log('Fingerprints from File2:', [...fingerprints2]);

    return compareFingerprints(fingerprints1, fingerprints2);
}

// Sample usage:
const file1Path = 'file1.js';
const file2Path = 'file2.js';
const score = plagiarismScore(file1Path, file2Path);
console.log(`Plagiarism score between ${file1Path} and ${file2Path} is: ${score * 100}%`);
