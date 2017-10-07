'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function lookupSymbol(symbol: string) {
    return <Promise<vscode.SymbolInformation[]>>
        vscode.commands.executeCommand('vscode.executeWorkspaceSymbolProvider', symbol);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "codegraph" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('codegraph.AddGraphElement', async () => {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);

        if (!text) {
            return;
        }

        try {
            let syms = await lookupSymbol(text);

            syms = syms.filter((s: vscode.SymbolInformation) =>
                s.kind !== vscode.SymbolKind.Namespace);

            // This is called if the symbol is found
            console.log('lookupSymbol ' + text + " OK!");
            syms.forEach((sym) => {
                console.log("symbol name=" + sym.name);
                console.log("symbol containerName=" + sym.containerName);
                console.log("symbol kind=" + sym.kind);
                console.log("symbol path=" + vscode.workspace.asRelativePath(sym.location.uri.fsPath, true));
                console.log("symbol line=(" + sym.location.range.start.line + "," + sym.location.range.end.line + ")");
                vscode.window.showInformationMessage("CodeGraph file " + vscode.workspace.asRelativePath(sym.location.uri.fsPath, true) +
                    " line " + sym.location.range.start.line);
            });
        } catch (err) {
            console.log("lookupSymbol error " + err);
        }

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}