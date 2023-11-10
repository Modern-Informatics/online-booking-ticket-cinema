import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds = 10;
  // salt = bcrypt.genSalt(this.saltRounds);

  public async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  public async hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }
}
