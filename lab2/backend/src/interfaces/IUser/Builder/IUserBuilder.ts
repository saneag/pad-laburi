import { UserBuilder } from '../../../controllers/User/Builder/UserBuilder';
import { IUserRegister, IUserUpdate } from '../IUser';

export interface IUserBuilder extends IUserRegister {
    setFirstName(firstName: string): UserBuilder;
    setLastName(lastName: string): UserBuilder;
    setEmail(email: string): UserBuilder;
    setPasswordHash(passwordHash: string): UserBuilder;
    setAvatarUrl(avatarUrl: string): UserBuilder;
    setDescription(description: string): UserBuilder;

    build(): IUserRegister;
    buildUpdate(): IUserUpdate;
}
