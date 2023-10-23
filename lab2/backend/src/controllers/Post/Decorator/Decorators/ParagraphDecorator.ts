import { TextDecorator } from '../TextDecorator';
import { TextSimplify } from '../TextSimplify';

export class ParagraphDecorator extends TextDecorator {
    decorate(text: string) {
        const replacedTagsText = text
            .replaceAll(this.getStartTag(), this.getDecoratorTag())
            .replaceAll(this.getEndTag(), this.getDecoratorTag());

        super.decorate(replacedTagsText);
    }

    getStartTag(): string {
        return '<p>';
    }

    getEndTag(): string {
        return '</p>';
    }

    getDecoratorTag(): string {
        return '!@';
    }
}

export class ParagraphSimplify extends TextSimplify {
    simplify(text: string) {
        const regex = new RegExp(
            `${this.getDecoratorTag()}(.*?)${this.getDecoratorTag()}`,
            'g'
        );

        const replacedTagsText = text.replace(
            regex,
            `${this.getStartTag()}$1${this.getEndTag()}`
        );

        super.simplify(replacedTagsText);
    }

    getStartTag(): string {
        return '<p>';
    }

    getEndTag(): string {
        return '</p>';
    }

    getDecoratorTag(): string {
        return '\\!\\@';
    }
}
