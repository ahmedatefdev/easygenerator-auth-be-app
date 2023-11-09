import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: string) {
    console.log(
      '🚀 ~ file: users.service.ts:18 ~ UsersService ~ findOne ~ id:',
      id,
    );
    if (!id) {
      return null;
    }
    const OBID = new ObjectId(id);
    console.log(
      '🚀 ~ file: users.service.ts:26 ~ UsersService ~ findOne ~ OBID:',
      OBID,
    );
    return this.repo.findOne({
      where: { _id: OBID as any },
    });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }
}
