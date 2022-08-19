import { Body, Controller, Get, Post,Delete,Patch } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth-bcrypt')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('new')
  async onboardEmployee(@Body() data: any) {

          const user = await this.appService.newEmployee(data);
          return {
                  message:'Employee onboarded successfully',
                  user
  };
}

@Get('all')
async getEmployee() {
        const users = await this.appService.getEmployee();
        return {
                message:'All data returned',
                users
        };
}

@Post('bcrypt-sign')
async signin(@Body() data:any) {
        const auth = await this.appService.signin(data);
        return {
                message:'userName and passWord posted successfully',
                auth
             };
}

@Get('signall')
async getAll() {
        const auths = await this.appService.signal();
        return {
                message:'All auths returned',
                auths
        };
}

@Delete('userName')
async delete(@Body()data:any) {
        await this.appService.destroy(data);
        return {
                message:'repeated data deleted',
        };
}

@Get('auth')
async auth(@Body() data:any) {
     const verif = await this.appService.authbcrypt(data);
    console.log(verif);
     return {
             message:'UserName verified sucessfully',
             verif
     };
}  

@Post('delete')
async deleted(@Body() data:any) {
      return await this.appService.deleted(data);
}

@Patch('update')
async updated(@Body() data:any) {
	const result = await this.appService.updateEmployee(data);
	console.log(result);
	return result;
}
}

