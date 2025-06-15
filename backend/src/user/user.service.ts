// src/users/users.service.ts
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/createUserDto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmailAndPassword(email: string, password: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, password }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
        const user = new this.userModel(createUserDto);
        return await user.save();
      } catch (err) {
        if (err.code === 11000 && err.keyPattern?.email) {
            throw new ConflictException('Email already exists');
          }
        throw new InternalServerErrorException('Failed to register user');
      }
  }

  // async update(id: string, updateData: Partial<User>): Promise<User> {
  //   const updated = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  //   if (!updated) throw new NotFoundException('User not found');
  //   return updated;
  // }

  // async delete(id: string): Promise<{ message: string }> {
  //   const result = await this.userModel.findByIdAndDelete(id);
  //   if (!result) throw new NotFoundException('User not found');
  //   return { message: 'User deleted successfully' };
  // }

}
