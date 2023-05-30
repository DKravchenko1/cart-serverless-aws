import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { User } from '../users/interfaces';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly sequelize: Sequelize,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    console.log('validateUser', name, password);
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.usersService.findOneByUserName(name, transaction);
      const result = user
        ? user
        : await this.usersService.createOne({ name, password }, transaction);
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
    }
  }

  login(user: User, type) {
    const LOGIN_MAP = {
      jwt: this.loginJWT,
      basic: this.loginBasic,
      default: this.loginJWT,
    };
    const login = LOGIN_MAP[type];

    return login ? login(user) : LOGIN_MAP.default(user);
  }

  loginJWT(user: User) {
    const payload = { username: user.name, sub: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  loginBasic(user: User) {
    console.log(user);

    function encodeUserToken(user) {
      const { id, name, password } = user;
      console.log('user', id, name, password);
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }
}
