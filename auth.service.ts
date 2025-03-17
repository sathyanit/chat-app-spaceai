import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private users = [{ id: 1, username: 'test', password: bcrypt.hashSync('password', 10) }];

  async validateUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return { id: user.id, username: user.username };
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) throw new Error('Invalid credentials');
    return { token: jwt.sign(user, 'secret', { expiresIn: '1h' }) };
  }
}
