import { TextDecorator } from '../TextDecorator';
import { TextSimplify } from '../TextSimplify';

export class DeletedTextDecorator extends TextDecorator {
    decorate(text: string) {
        const replacedTagsText = text
            .replaceAll(this.getStartTag(), this.getDecoratorTag())
            .replaceAll(this.getEndTag(), this.getDecoratorTag());

        super.decorate(replacedTagsText);
    }

    getStartTag(): string {
        return '<s>';
    }

    getEndTag(): string {
        return '</s>';
    }

    getDecoratorTag(): string {
        return '~~';
    }
}

export class DeletedTextSimplify extends TextSimplify {
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
        return '<s>';
    }

    getEndTag(): string {
        return '</s>';
    }

    getDecoratorTag(): string {
        return '\\~\\~';
    }
}
