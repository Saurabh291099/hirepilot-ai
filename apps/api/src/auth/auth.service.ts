import {
  ConflictException,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '@jobpilot/database';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { DataSource } from 'typeorm';
import { z } from 'zod';
import { DATABASE_DATA_SOURCE } from '../database/database.constants';
import type { AuthUser, LoginInput, RegisterInput } from './auth.types';

const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type StoredUser = Omit<AuthUser, 'token'> & { passwordHash: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Optional()
    @Inject(DATABASE_DATA_SOURCE)
    private readonly dataSource: DataSource | null,
  ) {}

  private readonly users: StoredUser[] = [];

  async register(input: RegisterInput): Promise<AuthUser> {
    const result = registerSchema.safeParse(input);
    if (!result.success)
      throw new UnauthorizedException(
        'Enter a valid name, email, and password.',
      );
    const email = result.data.email.toLowerCase();
    if (await this.findUser(email)) {
      throw new ConflictException('An account with this email already exists.');
    }
    const user: StoredUser = {
      id: crypto.randomUUID(),
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email,
      passwordHash: this.hashPassword(result.data.password),
    };
    if (this.dataSource?.isInitialized) {
      const savedUser = await this.dataSource
        .getRepository(UserEntity)
        .save(user);
      return this.withToken(savedUser);
    }
    this.users.push(user);
    return this.withToken(user);
  }

  async login(input: LoginInput): Promise<AuthUser> {
    const result = loginSchema.safeParse(input);
    const user = result.success
      ? await this.findUser(result.data.email.toLowerCase())
      : undefined;
    if (!user)
      throw new UnauthorizedException('Email or password is incorrect.');
    return this.withToken(user);
  }

  private async findUser(email: string): Promise<StoredUser | null> {
    if (!this.dataSource?.isInitialized) {
      return this.users.find((user) => user.email === email) ?? null;
    }
    const user = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
    return user ? { ...user } : null;
  }

  private withToken(user: StoredUser): AuthUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return {
      ...safeUser,
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  }

  private verifyPassword(password: string, storedHash: string) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(password, salt, 64);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }
}
