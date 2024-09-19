
import { compareSync, hashSync } from 'bcryptjs';

export class BcryptAdapter {
    static Hash (password: string): string {
        return hashSync(password);
    }

    static Compare (password: string, hashed: string): boolean {
        return compareSync(password, hashed);
    }
}

