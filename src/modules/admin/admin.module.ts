import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../user/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Admin, User])],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [AdminService]

})
export class AdminModule {}
