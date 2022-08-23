import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authentication,Employees,Hash } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {

constructor( 
       @InjectRepository(Authentication)
       private AR: Repository<Authentication>,

        @InjectRepository(Employees)
        private ER: Repository<Employees>,

	@InjectRepository(Hash)
	private HR: Repository<Hash>,

	private jwtService: JwtService
){}

async newEmployee(data: any) {
    //  const user = await this.AR.findOne({where: {companyMail:data.companyMail},});

       const name = await this.ER.findOne({where: {name:data.name},});

              if(name == null) {
                const employeeId = Math.floor(Math.random()*1000)
                const companyMail = `${data.name.toLowerCase()}@gmail.com`;
                const newEmp = {...data,employeeId,companyMail };

                const postEmp =  await this.ER.save(newEmp);
                console.log(postEmp);
                return 'Employee Posted'
              }
              else {
                      throw new Error('Error founded');
              }
}

async getEmployee() {
        return await this.ER.find();
}

async signup(data: any) {
        console.log(data);
        const userName = data.userName;
           console.log(userName);

           const passWord = data.passWord;
           console.log(passWord);

	   const pass = await bcrypt.hash(passWord,10);
	   console.log(pass);



           const sign = {userName,pass };
           console.log(sign)

           const signin = await this.HR.save(sign);
          console.log(signin);
           return signin;
}

async signall() {
   return await this.HR.find();
}

async logIn(data:any) {
	console.log(data);

	const found = await this.HR.findOne({where:{userName:data.userName},});
	console.log(found);
	
	try {
	if(found.userName === data.userName)  {
		const hashedPass =  found.passWord
		console.log(hashedPass);
		const pass = data.passWord;
		console.log(pass);
		const passed = await bcrypt.compare(pass,hashedPass);
		console.log(passed);

		if(passed === false) {
		return 'Username / PassWord Incorrect';
		} 
		else {
	/**	const find = await this.ER.findOne({where:{name:data.userName},});
		console.log(find);
		return find; **/

	       const payload = {name:data.userName, secret:'secretKey' };
	       console.log(payload);
	       const jwt = await this.jwtService.sign(payload);
	       console.log('jwt',jwt);
	       return jwt;

		} 
	}
 }
   catch {
	  throw new Error ('username/Password Incorrect');
}
}

async findEmployee(data:any) {
	console.log(data);
	try {
		const valid = await this.jwtService.verify(data.authorization,{secret:'secretKey'});
		console.log(valid);

		const res =  await this.ER.findOne({where:{name:valid.name},});
		console.log(res);
		return res;
	}
	catch {
		return 'userName/passWord Incorrect!';
	}
}

async deleted(data:any) {
	console.log(data);

       	try {
	const valid = await this.jwtService.verify(data.authorization,{secret:'secretKey'});
	console.log(valid);

	await this.ER.update({name:valid.name},{isActive:false});
	return 'You are fired';
  }
 catch(error) {
	 return `Data Invalid : ${error.message}`;
 }
}

async updateEmployee(data:any) {
       console.log(data);

       try {
	  const valid = await this.jwtService.verify(data.authorization,{secret:'secretKey'});
	  console.log(valid);

	  const changed = await this.ER.update({name:valid.name},data);
	  console.log(changed);
	  return 'Data updated Successfully';

	}
        catch (err){
		return `Error found: ${err.message}`
	}
    }
}
