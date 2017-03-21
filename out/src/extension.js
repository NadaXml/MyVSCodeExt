"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
const vscode_1 = require("vscode");
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "WordCount" is now active!');
    // create a new word counter
    let wordCounter = new WordCounter();
    var disposable = vscode_1.commands.registerCommand('extension.sayHello', () => {
        wordCounter.updateWordCount();
    });
    let controller = new WordCounterController(wordCounter);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(disposable);
    context.subscriptions.push(controller);
}
exports.activate = activate;
class WordCounter {
    updateWordCount() {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        // Get the current text editor
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;
        // Only update status if an Markdown file
        if (doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);
            // Update the status bar
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    }
    _getWordCount(doc) {
        let docContent = doc.getText();
        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }
        return wordCount;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class WordCounterController {
    constructor(wordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._wordCounter.updateWordCount();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._wordCounter.updateWordCount();
    }
}
//# sourceMappingURL=extension.js.map