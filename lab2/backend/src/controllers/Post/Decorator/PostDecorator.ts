import { PostFacade } from '../Facade/PostFacade';

export class PostDecorator {
    decorateText(content: string) {
        const postFacade = new PostFacade();
        return postFacade.decorateText(content);
    }

    simplifyText(content: string) {
        const postFacade = new PostFacade();
        return postFacade.simplifyText(content);
    }
}
