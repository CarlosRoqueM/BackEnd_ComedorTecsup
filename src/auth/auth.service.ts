import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {compare} from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';


@Injectable()
export class AuthService {

    constructor (@InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository:Repository<Rol>,
    private jwtService: JwtService){}
    
    async register(user: RegisterAuthDto) {

        const {email, phone} = user;

       const emailExist  = await this.usersRepository.findOneBy({email:email})

       if (emailExist){
        throw new HttpException('El email esta en uso', HttpStatus.CONFLICT);
       }

       const phoneExist  = await this.usersRepository.findOneBy({phone:phone})

       if (phoneExist){
        throw new HttpException('El numero esta en uso', HttpStatus.CONFLICT);
       }

        const newUser = this.usersRepository.create(user);

       let rolesIds = [];
        
       if(user.rolesIds !== undefined && user.rolesIds !== null){
            rolesIds = user.rolesIds;
       }else{
        rolesIds.push('CLIENT')
       }

        
        const roles = await this.rolesRepository.findBy({id: In(rolesIds)});

        newUser.roles = roles;

        const userSave = await this.usersRepository.save(newUser);
        const rolesString = userSave.roles.map(rol => rol.id);

        const payload = {id: userSave.id, name:userSave.name, roles: rolesString};
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

        const usersearch = await this.usersRepository.findOne({ 
            where: {email : email},
            relations: ['roles']
        })
        if (!usersearch){
            throw new HttpException('El email no existe', HttpStatus.NOT_FOUND);
        }

        const passwordValid = await compare(password, usersearch.password)
        if (!passwordValid){
            throw new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN);
        }

        const rolesIds = usersearch.roles.map(rol => rol.id);

        const payload = {id: usersearch.id, name:usersearch.name, roles:rolesIds };
        const token = this.jwtService.sign(payload);
        const data = {
            user: usersearch,
            token:'Bearer ' + token
        }

        delete data.user.password
        
        return data;

    }

}
