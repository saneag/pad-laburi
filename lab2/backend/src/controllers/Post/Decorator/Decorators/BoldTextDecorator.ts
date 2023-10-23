import { TextDecorator } from '../TextDecorator';
import { TextSimplify } from '../TextSimplify';

export class BoldTextDecorator extends TextDecorator {
    decorate(text: string) {
        const replacedTagsText = text
            .replaceAll(this.getStartTag(), this.getDecoratorTag())
            .replaceAll(this.getEndTag(), this.getDecoratorTag());

        super.decorate(replacedTagsText);
    }

    getStartTag(): string {
        return '<strong>';
    }

    getEndTag(): string {
        return '</strong>';
    }

    getDecoratorTag(): string {
        return '**';
    }
}

export class BoldTextSimplify extends TextSimplify {
    simplify(text: string) {
        const regex = new RegExp(
            `${this.getDecoratorTag()}(.*?)${this.getDecoratorTag()}`,
            'g'
        );

        const replacedTagsText = text.replaceAll(
            regex,
            `${this.getStartTag()}$1${this.getEndTag()}`
        );

        super.simplify(replacedTagsText);
    }

    getStartTag(): string {
        return '<strong>';
    }

    getEndTag(): string {
        return '</strong>';
    }

    getDecoratorTag(): string {
        return '\\*\\*';
    }
}
