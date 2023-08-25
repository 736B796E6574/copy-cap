import ast
import re

# Tokenization
def tokenize(text):
    return re.findall(r'\b\w+\b', text)

# Generating k-grams
def kgrams(tokens, k):
    return [tokens[i:i+k] for i in range(len(tokens) - k + 1)]

# Hashing k-grams
def hash_kgram(kgram):
    return hash(tuple(kgram))

# Winnowing for fingerprints
def winnow(hashes, w):
    fingerprints = set()
    for i in range(len(hashes) - w + 1):
        window = hashes[i:i+w]
        fingerprints.add(min(window))
    return fingerprints

# Normalization using AST
def normalize_code(code):
    tree = ast.parse(code)
    
    # Rename variables consistently
    for node in ast.walk(tree):
        if isinstance(node, ast.Name):
            node.id = 'VAR'
    
    # Dump the modified AST back to a code string
    normalized_code = ast.dump(tree)
    
    # Return normalized code without comments and whitespaces
    return ''.join(normalized_code.split())

# Main function to compute plagiarism score
def plagiarism_score(file1, file2, k=50, w=30):
    with open(file1, 'r') as f:
        code1 = f.read()
        normalized1 = normalize_code(code1)
        tokens1 = tokenize(normalized1)
        hashes1 = [hash_kgram(kgram) for kgram in kgrams(tokens1, k)]
        fingerprints1 = winnow(hashes1, w)

    with open(file2, 'r') as f:
        code2 = f.read()
        normalized2 = normalize_code(code2)
        tokens2 = tokenize(normalized2)
        hashes2 = [hash_kgram(kgram) for kgram in kgrams(tokens2, k)]
        fingerprints2 = winnow(hashes2, w)

    return compare_fingerprints(fingerprints1, fingerprints2)

def compare_fingerprints(fingerprints1, fingerprints2):
    intersection = fingerprints1.intersection(fingerprints2)
    union = fingerprints1.union(fingerprints2)
    return len(intersection) / len(union) if len(union) != 0 else 0

# Sample usage
file1_path = "file1.py"
file2_path = "file2.py"

score = plagiarism_score(file1_path, file2_path)
print(f"Plagiarism score between {file1_path} and {file2_path} is: {score}")

if __name__ == "__main__":
    score = plagiarism_score('file1.py', 'file2.py')
    print(f"Plagiarism Score: {score * 100:.2f}%")
