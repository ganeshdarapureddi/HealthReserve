
import { Controller, Get, Param, UseGuards  } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiBearerAuth('jwt-auth')//should be added to get the authorize button at top 
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }


  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.findById(id);
  }
  
}
