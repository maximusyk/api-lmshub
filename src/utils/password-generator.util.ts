import * as bcrypt from 'bcrypt';

export const generatePassword = (): string => {
    return Math.random().toString(36).slice(-9);
}