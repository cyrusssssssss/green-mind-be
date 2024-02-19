import {
    Controller,
    Get,
    Param,
    NotFoundException
  } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './entity/admin.entity';
  
  @Controller('admin')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  
    @Get(':username')
    async getAdminByUsername(
      @Param('username') username: string,
    ): Promise<Admin> {
      const admin = await this.adminService.getAdminByUsername(username);
  
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return admin;
    }
}
  