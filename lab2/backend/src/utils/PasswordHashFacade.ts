import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

export async function comparePasswords(
    password: string,
    passwordHash: string
): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
}
