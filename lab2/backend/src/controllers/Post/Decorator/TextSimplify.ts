import { ITextSimplify } from '../../../interfaces/IPost/Decorator/IPostDecorator';

export class BasicTextEditorSimplify implements ITextSimplify {
    private text: string;

    constructor() {
        this.text = '';
    }

    simplify(text: string) {
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

export abstract class TextSimplify implements ITextSimplify {
    protected textEditor: ITextSimplify;

    constructor(textEditor: ITextSimplify) {
        this.textEditor = textEditor;
    }

    simplify(text: string): void {
        this.textEditor.simplify(text);
    }

    getText(): string {
        return this.textEditor.getText();
    }

    abstract getStartTag(): string;
    abstract getEndTag(): string;
    abstract getDecoratorTag(): string;
}
