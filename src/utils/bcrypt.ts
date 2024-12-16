import bcrypt from 'bcrypt';

export const compareHash = (plainText: string, encrypted: string): boolean => {
    return bcrypt.compareSync(plainText, encrypted);
}

export const hash = (plainText: string): string => {
    return bcrypt.hashSync(plainText, bcrypt.genSaltSync(12));
}