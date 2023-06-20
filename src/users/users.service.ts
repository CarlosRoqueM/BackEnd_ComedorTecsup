import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { User } from './user.entity';
import {Repository} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { async } from 'rxjs';
import storage = require ('../utils/cloud_storage');
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) 
        private usersdRepository:Repository<User>,
    ){}

    create(user:CreateUserDto){
        const newUser = this.usersdRepository.create(user);
        return this.usersdRepository.save(newUser);
    }

    findAll(){
        return this.usersdRepository.find({relations: ['roles']});
    }

    async update(id:number, user:UpdateUserDto){

        const userFound = await this.usersdRepository.findOneBy({id:id})

        if (!userFound){
            throw new HttpException('Usuario inexistente', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userFound, user);
        return this.usersdRepository.save(updateUser);

    }

    

    async updateWithImage(file: Express.Multer.File, id: number, user: UpdateUserDto){
        const url = await storage(file, file.originalname);
        console.log('URL: ' + url);

        if(url === undefined && url === null){
            throw new HttpException('Error al guardar la imagen', HttpStatus.INTERNAL_SERVER_ERROR);

        }

        const userFound = await this.usersdRepository.findOneBy({id:id})

        if (!userFound){
            throw new HttpException('Usuario inexistente', HttpStatus.NOT_FOUND);
        }
        user.image = url;
        const updateUser = Object.assign(userFound, user);
        return this.usersdRepository.save(updateUser);
    }

}
