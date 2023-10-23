export interface ITextEditor {
    decorate(text: string): void;
    getText(): string;

    getStartTag(): string;
    getEndTag(): string;
    getDecoratorTag(): string;
}

export interface ITextSimplify {
    simplify(text: string): void;
    getText(): string;

    getStartTag(): string;
    getEndTag(): string;
    getDecoratorTag(): string;
}
