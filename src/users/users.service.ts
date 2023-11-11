import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('Auth');
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, username: string) {
    const user = this.repo.create({ email, password, name: username });
    this.logger.verbose(
      `🎉 Create new User with email ${email} & username ${username} `,
    );

    return this.repo.save(user);
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    const OBID = new ObjectId(id);
    this.logger.verbose(`🔎 search for user with id ${id} `);

    return this.repo.findOne({
      where: { _id: OBID as any },
    });
  }

  find(email: string) {
    this.logger.verbose(`🔎 search for user with email ${email} `);
    return this.repo.find({ where: { email } });
  }
}
