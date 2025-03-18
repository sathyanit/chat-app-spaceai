import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private users = [
    { id: 1, email: 'user@example.com', password: bcrypt.hashSync('password123', 10) },
    { id: 2, email: 'admin@example.com', password: bcrypt.hashSync('adminpass', 10) },
  ];

  private secretKey = 'mock-secret-key';

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = this.users.find((u) => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, this.secretKey, { expiresIn: '1h' });
    return { token };
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
