import conf from '../conf/conf';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;
    constructor() {
        console.log('Appwrite endpoint URL:', conf.appwriteUrl);
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
            console.log('Appwrite endpoint URL set:', this.client.config.endpoint);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            console.log('Create Account Response:', userAccount); 
            if (userAccount) {
                
                return this.login({email, password});
            } else {
                return  userAccount;
            }
        }catch(error){
           console.log("Appwrite service :: createdPost :: error",error);
        }
      
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: createdPost :: error",error);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions('');
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}




export default new AuthService();
