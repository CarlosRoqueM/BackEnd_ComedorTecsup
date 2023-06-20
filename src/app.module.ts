import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { Rol } from './roles/rol.entity';





@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'menutec_db',
    entities: [User, Rol],
    synchronize: true,
  }),
  
  UsersModule, AuthModule, RolesModule, 
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
