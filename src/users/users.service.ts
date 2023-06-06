import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { User } from './user.entity';
import {Repository} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { async } from 'rxjs';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) 
        private usersdRepository:Repository<User>
    ){}

    create(user:CreateUserDto){
        const newUser = this.usersdRepository.create(user);
        return this.usersdRepository.save(newUser);
    }

    findAll(){
        return this.usersdRepository.find()
    }

    async update(id:number, user:UpdateUserDto){

        const userFound = await this.usersdRepository.findOneBy({id:id})

        if (!userFound){
            return new HttpException('Usuario inexistente', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userFound, user);
        return this.usersdRepository.save(updateUser);

    }

    async updateImage(image: Express.Multer.File){

    }

}
