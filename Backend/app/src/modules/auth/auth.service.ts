import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { AuthUser, JwtPayload } from './auth-user';
import { normalizeUsername } from './auth.rules';
import { JWT_EXPIRES_IN_SECONDS } from './jwt.config';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const usernameKey = normalizeUsername(dto.username);
    if (await this.users.existsBy({ usernameKey })) {
      throw this.usernameTaken(dto.username);
    }

    const passwordHash = await hash(dto.password, BCRYPT_ROUNDS);
    let user: User;
    try {
      user = await this.users.save(
        this.users.create({
          username: dto.username,
          usernameKey,
          passwordHash,
        }),
      );
    } catch (error) {
      // Lost a race with a concurrent registration of the same name.
      if (error instanceof QueryFailedError) {
        throw this.usernameTaken(dto.username);
      }
      throw error;
    }
    return this.issueToken(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.users.findOne({
      where: { usernameKey: normalizeUsername(dto.username) },
      select: ['id', 'username', 'passwordHash'],
    });
    // Same message for unknown user and wrong password.
    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.issueToken(user);
  }

  async findUser(id: number): Promise<AuthUser | null> {
    return this.users.findOne({
      where: { id },
      select: ['id', 'username'],
    });
  }

  private async issueToken(user: AuthUser): Promise<AuthResponseDto> {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      accessToken: await this.jwt.signAsync(payload),
      expiresIn: JWT_EXPIRES_IN_SECONDS,
      user: { id: user.id, username: user.username },
    };
  }

  private usernameTaken(username: string) {
    return new ConflictException(`Username "${username}" is already taken`);
  }
}
