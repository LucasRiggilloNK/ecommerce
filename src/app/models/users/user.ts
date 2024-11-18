export class Usuario {
/*     public age: number;
 */  
    constructor(
      public name: string,
      public lastname: string,
      public birthdate: Date,
      public province: string,
      public city: string,
      public street: string,
      public streetNumber: string,
      public floor: string,
      public flat: string,
      public email: string,
      public password: string
    ) {
      //this.age = this.calculateAge(birthdate);
    }
  
/*     private calculateAge(birthdate: Date): number {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } */
  }
  