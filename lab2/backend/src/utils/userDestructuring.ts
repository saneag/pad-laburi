export const UserDestructuring = (user: any) => {
    const {
        firstName,
        lastName,
        email,
        role,
        avatarUrl,
        description,
        createdAt,
        updatedAt,
    } = user;

    return {
        firstName,
        lastName,
        email,
        avatarUrl,
        description,
        createdAt,
        updatedAt,
    };
};
