import { IBasicPost, IImagePost, IPostUpdate } from '../IPost';
import { ISimpleUser } from '../../IUser/IUser';

export interface IPostBuilder {
    setCreator(creator: ISimpleUser): IPostBuilder;
    setTitle(title: string): IPostBuilder;
    setContent(content: string): IPostBuilder;
    setImage(image: string): IPostBuilder;
    setUpdatedAt(updatedAt: Date): IPostBuilder;

    buildSimplePost(): IBasicPost;
    buildPostWithImages(): IImagePost;
    buildUpdate(): IPostUpdate;
}
