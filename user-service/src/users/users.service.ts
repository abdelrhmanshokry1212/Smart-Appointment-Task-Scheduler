
import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly httpService: HttpService) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const createdUser = new this.userModel(createUserDto);
            const savedUser = await createdUser.save();
            this.sendAuditLog('REGISTER_USER', savedUser._id.toString(), `User registered: ${savedUser.email}`);
            return savedUser;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userModel.findOne({ email: loginUserDto.email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // In a real app, use bcrypt to compare passwords
        if (user.password !== loginUserDto.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        this.sendAuditLog('LOGIN_USER', user._id.toString(), `User logged in: ${user.email}`);

        // Return user info (excluding password)
        const { password, ...result } = user.toObject();
        return result;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(id: string, updateUserDto: any): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        this.sendAuditLog('UPDATE_USER', id, `User updated profile: ${updatedUser.email}`);
        return updatedUser;
    }

    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        this.sendAuditLog('DELETE_USER', id, `User deleted account: ${deletedUser.email}`);
        return deletedUser;
    }

    private async sendAuditLog(action: string, userId: string, details: string) {
        try {
            await firstValueFrom(
                this.httpService.post('http://127.0.0.1:3004/logs', {
                    action,
                    userId,
                    details
                })
            );
        } catch (error) {
            console.error('Failed to send audit log:', error.message);
        }
    }
}
