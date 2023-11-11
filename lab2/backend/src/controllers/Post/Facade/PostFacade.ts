import {
    ITextEditor,
    ITextSimplify,
} from '../../../interfaces/IPost/Decorator/IPostDecorator';

import { BasicTextEditor } from '../Decorator/TextDecorator';
import { BasicTextEditorSimplify } from '../Decorator/TextSimplify';

import { decorators, simplifyDecorators } from '../Decorator/Decorators';

export class PostFacade {
    decorateText(content: string) {
        const editor: ITextEditor = new BasicTextEditor();

        const decoratorsList: ITextEditor[] = [
            new decorators.BoldTextDecorator(editor),
            new decorators.ItalicTextDecorator(editor),
            new decorators.DeletedTextDecorator(editor),
            new decorators.ParagraphDecorator(editor),
        ];

        let decoratedContent = content;

        decoratorsList.forEach((decorator) => {
            decorator.decorate(decoratedContent);
            decoratedContent = decorator.getText();
        });

        return editor.getText();
    }

    simplifyText(content: string) {
        const editor: ITextSimplify = new BasicTextEditorSimplify();

        const simplifyDecoratorsList: ITextSimplify[] = [
            new simplifyDecorators.BoldTextSimplify(editor),
            new simplifyDecorators.ItalicTextSimplify(editor),
            new simplifyDecorators.DeletedTextSimplify(editor),
            new simplifyDecorators.ParagraphSimplify(editor),
        ];

        let decoratedContent = content;

        simplifyDecoratorsList.forEach((decorator) => {
            decorator.simplify(decoratedContent);
            decoratedContent = decorator.getText();
        });

        return editor.getText();
    }
}
