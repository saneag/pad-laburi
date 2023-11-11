import { IPostBuilder } from '../../../interfaces/IPost/Builder/IPostBuilder';
import {
    IBasicPost,
    IImagePost,
    IPostUpdate,
} from '../../../interfaces/IPost/IPost';
import { ISimpleUser } from '../../../interfaces/IUser/IUser';

export class PostBuilder implements IPostBuilder {
    public creator: ISimpleUser;
    public title: string;
    public content: string;
    public image: string;
    public updatedAt: Date;

    constructor() {
        this.creator = {
            firstName: '',
            lastName: '',
            avatarUrl: '',
            email: '',
        };
        this.title = '';
        this.content = '';
        this.image = '';
        this.updatedAt = new Date();
    }

    setContent(content: string): IPostBuilder {
        this.content = content;
        return this;
    }

    setImage(image: string): IPostBuilder {
        this.image = image;
        return this;
    }

    setTitle(title: string): IPostBuilder {
        this.title = title;
        return this;
    }

    setCreator(creator: ISimpleUser): IPostBuilder {
        this.creator = creator;
        return this;
    }

    setUpdatedAt(updatedAt: Date): IPostBuilder {
        this.updatedAt = updatedAt;
        return this;
    }

    buildSimplePost(): IBasicPost {
        return {
            creator: this.creator,
            title: this.title,
            content: this.content,
        };
    }

    buildPostWithImages(): IImagePost {
        return {
            creator: this.creator,
            title: this.title,
            content: this.content,
            image: this.image,
        };
    }

    buildUpdate(): IPostUpdate {
        return {
            title: this.title,
            content: this.content,
            image: this.image,
            updatedAt: this.updatedAt,
        };
    }
}
