import { ITextEditor } from '../../../interfaces/IPost/Decorator/IPostDecorator';

export class BasicTextEditor implements ITextEditor {
    private text: string;

    constructor() {
        this.text = '';
    }

    decorate(text: string) {
        this.text = text;
    }

    getText(): string {
        return this.text;
    }

    getStartTag(): string {
        return '';
    }

    getEndTag(): string {
        return '';
    }

    getDecoratorTag(): string {
        return '';
    }
}

export abstract class TextDecorator implements ITextEditor {
    protected textEditor: ITextEditor;

    constructor(textEditor: ITextEditor) {
        this.textEditor = textEditor;
    }

    decorate(text: string): void {
        this.textEditor.decorate(text);
    }

    getText(): string {
        return this.textEditor.getText();
    }

    abstract getStartTag(): string;
    abstract getEndTag(): string;
    abstract getDecoratorTag(): string;
}
