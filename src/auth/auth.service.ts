import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {compare} from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor (@InjectRepository(User) private usersRepository: Repository<User>, private jwtService: JwtService){}

    async register(user: RegisterAuthDto) {

        const {email, phone} = user;

       const emailExist  = await this.usersRepository.findOneBy({email:email})

       if (emailExist){
        return new HttpException('El email esta en uso', HttpStatus.CONFLICT);
       }

       const phoneExist  = await this.usersRepository.findOneBy({phone:phone})

       if (phoneExist){
        return new HttpException('El numero esta en uso', HttpStatus.CONFLICT);
       }

        const newUser = this.usersRepository.create(user);
        const userSave = await this.usersRepository.save(newUser);

        const payload = {id: userSave.id, name:userSave.name};
        const token = this.jwtService.sign(payload);
        const data = {
            user: userSave,
            token:'Bearer ' + token
        }

        delete data.user.password;
        
        return data;
    }

    async login(login: LoginAuthDto){
        
        const {email , password} = login;

        const usersearch = await this.usersRepository.findOneBy({ email: email})
        if (!usersearch){
            return new HttpException('El email no existe', HttpStatus.NOT_FOUND);
        }

        const passwordValid = await compare(password, usersearch.password)
        if (!passwordValid){
            return new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN);
        }

        const payload = {id: usersearch.id, name:usersearch.name};
        const token = this.jwtService.sign(payload);
        const data = {
            user: usersearch,
            token:'Bearer ' + token
        }

        delete data.user.password
        
        return data;

    }

}
