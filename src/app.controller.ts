import { Body, Controller, Get, Post,Delete,Patch, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('jwt')
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

@Get('get-all')
async getEmployee() {
        const users = await this.appService.getEmployee();
        return {
                message:'All data returned',
                users
        };
}

@Post('signIn')
async signup(@Body() data:any) {
        const auth = await this.appService.signup(data);
        return {
                message:'userName and passWord posted successfully',
                auth
             };
}

@Get('signall')
async getAll() {
        const auths = await this.appService.signall();
        return {
                message:'All auths returned',
                auths
        };
}

@Get('LogIn')
async auth(@Body() data:any) {
     const ver = await this.appService.logIn(data);
    console.log(ver);
     return {
             message:'UserName verified sucessfully',
             ver
     };
}  

@Get('find')
async findEmployee(@Body() data:any, @Headers() headers) {
	console.log(headers);
	const found = await this.appService.findEmployee(headers);
	console.log(found);
	return {
		message:'Data found successfully',
		found
	}
}

@Delete('remove')
async deleted(@Body() data:any,@Headers() headers) {
	console.log(headers);
      
	return await this.appService.deleted(headers);
}

@Patch('update')
async updated(@Body() data:any,@Headers() headers) {
        console.log(headers); 

	const result = await this.appService.updateEmployee(headers);
	console.log(result);
	return result;
}
}

