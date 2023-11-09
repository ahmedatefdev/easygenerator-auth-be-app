import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this._id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this._id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this._id);
  }
}
