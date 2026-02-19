const vscode = require('vscode');

/**
 * This function activates the extension.
 * It registers a Document Symbol Provider for AutoLISP files
 * to detect functions and commands and display them in the Outline view.
 */
function activate(context) {
    // Register a document symbol provider for AutoLISP files
    vscode.languages.registerDocumentSymbolProvider({ language: 'autolisp' }, {
        provideDocumentSymbols(document) {
            const symbols = [];

            // Regular expression to match commands (defun c:commandName)
            const regexCommand = /\(\s*defun\s+(C:[^\s\(]+)/gi;

            // Regular expression to match functions (defun functionName)
            const regexFunction = /\(\s*defun\s+([^\s\(]+)/gi;

            // Iterate through each line of the document to find matches
            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i).text;
                let match;

                // Find and add command symbols to the Outline
                while ((match = regexCommand.exec(line)) !== null) {
                    const symbol = new vscode.DocumentSymbol(
                        match[1], // Command name
                        'Command', // Symbol description
                        vscode.SymbolKind.Function, // Symbol kind (function)
                        new vscode.Range(i, match.index, i, line.length),
                        new vscode.Range(i, match.index, i, line.length)
                    );
                    symbols.push(symbol);
                }

                // Find and add function symbols to the Outline
                while ((match = regexFunction.exec(line)) !== null) {
                    const symbol = new vscode.DocumentSymbol(
                        match[1], // Function name
                        'Function', // Symbol description
                        vscode.SymbolKind.Function, // Symbol kind (function)
                        new vscode.Range(i, match.index, i, line.length),
                        new vscode.Range(i, match.index, i, line.length)
                    );
                    symbols.push(symbol);
                }
            }

            // Return the list of symbols found
            return symbols;
        }
    });
}

/**
 * This function deactivates the extension.
 */
function deactivate() {}

// Export the activate and deactivate functions
module.exports = {
    activate,
    deactivate
};
