import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){

    }

    @UseGuards(JwtAuthGuard)
    @Get()
        findAll(){
            return this.usersService.findAll();
    }

    @Post()
    create(@Body() user: CreateUserDto){
        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe)id : number, @Body() user: UpdateUserDto  ){
        return this.usersService.update(id, user);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }
}
