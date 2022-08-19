import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authentication,Employees,Hash } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {

constructor( 
       @InjectRepository(Authentication)
       private AR: Repository<Authentication>,

        @InjectRepository(Employees)
        private ER: Repository<Employees>,

	@InjectRepository(Hash)
	private HR: Repository<Hash>,
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

async signin(data: any) {
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

async signal() {
   return await this.HR.find();
}

async destroy(data:any){
        await this.HR.delete({userName:data.userName})
}

async authbcrypt(data:any) {
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
		const find = await this.ER.findOne({where:{name:data.userName},});
		console.log(find);
		return find;
		}
	}
 }
   catch {
	  throw new Error ('username/Password Incorrect');
}
}

async deleted(data:any) {
	const found = await this.HR.findOne({where:{userName:data.userName},});
	console.log(found);
 try {
	 if(found.userName === data.userName){
		 const hashed = found.passWord;
		 console.log(hashed);
		 const passWord = data.passWord;
		 console.log(passWord);
		 const match = await bcrypt.compare(passWord,hashed);
		 console.log(match);

		 if(match === false) {
			 return 'PassWord Incorrect';
		 } 
		 else {
			 await this.ER.update({name:data.userName},{isActive:false});
		 return 'you are fired';
              }
	 }
 }
 catch {
	 return 'userName/PassWord Incorrect';
 }
}

async updateEmployee(data:any) {
	const found = await this.HR.findOne({where:{userName:data.userName},});
	console.log(found);
	try {
		if(found.userName === data.userName) {
			const hashed = found.passWord;
			console.log(hashed);
			const passWord = data.passWord;
			console.log(passWord);
			const match = await bcrypt.compare(passWord,hashed);
			console.log(match);

			if(match === false) {
				return 'PassWord Incorrect'
			} 
			else {
				const name= data.userName
				delete data.userName
				delete data.passWord
				await this.ER.update({name:name},data)
				console.log("check",match,data)
				return 'updated successfuilly';
			}
		}
	}
        catch (err){
		return `Error found: ${err.message}`
	}
    }
}
