import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltOrRounds = 10;

  public async compare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  public async hash(password: string) {
    return bcrypt.hash(password, this.saltOrRounds);
  }
}
