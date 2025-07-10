import {
    Controller,
    Get,
    UseGuards,
    Request,
    Patch,
    Body,
    Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserProfileDto, ChangePasswordDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOne(req.user.id);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    @Patch('profile')
    async updateProfile(@Request() req, @Body() updateData: UpdateUserProfileDto) {
        return this.usersService.updateProfile(req.user.id, updateData);
    }

    @Put('change-password')
    async changePassword(@Request() req, @Body() changePasswordData: ChangePasswordDto) {
        return this.usersService.changePassword(req.user.id, changePasswordData);
    }
}
