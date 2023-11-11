import { IUserBuilder } from '../../../interfaces/IUser/Builder/IUserBuilder';
import { IUserUpdate, IUserRegister } from '../../../interfaces/IUser/IUser';

export class UserBuilder implements IUserBuilder {
    public firstName: string;
    public lastName: string;
    public email: string;
    public passwordHash: string;
    public avatarUrl: string;
    public description: string;

    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.passwordHash = '';
        this.avatarUrl = '';
        this.description = '';
    }

    public setFirstName(firstName: string): UserBuilder {
        this.firstName = firstName;
        return this;
    }

    public setLastName(lastName: string): UserBuilder {
        this.lastName = lastName;
        return this;
    }

    public setEmail(email: string): UserBuilder {
        this.email = email;
        return this;
    }

    public setPasswordHash(passwordHash: string): UserBuilder {
        this.passwordHash = passwordHash;
        return this;
    }

    public setAvatarUrl(avatarUrl: string): UserBuilder {
        this.avatarUrl = avatarUrl;
        return this;
    }

    public setDescription(description: string): UserBuilder {
        this.description = description;
        return this;
    }

    public build(): IUserRegister {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            passwordHash: this.passwordHash,
            avatarUrl: this.avatarUrl,
        };
    }

    public buildUpdate(): IUserUpdate {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            avatarUrl: this.avatarUrl,
            description: this.description,
        };
    }
}
