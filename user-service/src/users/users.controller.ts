
import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.usersService.login(loginUserDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
}
