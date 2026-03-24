import 'reflect-metadata';
import 'tsconfig-paths/register';
import { DeepPartial } from 'typeorm';
import { AppDataSource } from 'src/typeorm.config';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Subsidiary } from '@modules/departments/entities/subsidiary.entity';
import { Department } from '@modules/departments/entities/department.entity';

async function seed() {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);
    const subRepo = AppDataSource.getRepository(Subsidiary);
    const deptRepo = AppDataSource.getRepository(Department);

    // 1. Fetch the exact records created by your migration
    const hqSubsidiary = await subRepo.findOneBy({ domain: 'danagroup.com' });
    const itDept = await deptRepo.findOneBy({ 
        name: 'IT', 
        subsidiary_id: hqSubsidiary?.id 
    });

    if (!hqSubsidiary || !itDept) {
      throw new Error("Required Subsidiary (Dana Group HQ) or Department (IT) not found. Did you run the migration?");
    }

    const users: DeepPartial<User>[] = [
      {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'group_admin',
        jobTitle: 'CEO',
        subsidiary_id: hqSubsidiary.id, // Use the ID from the DB
        department_id: itDept.id,      // Use the ID from the DB
        isActive: true,
        avatarUrl: 'https://pravatar.cc',
      },
      {
        email: 'employee@example.com',
        firstName: 'Employee',
        lastName: 'User',
        role: 'employee',
        jobTitle: 'Developer',
        subsidiary_id: hqSubsidiary.id,
        department_id: itDept.id,
        isActive: true,
        avatarUrl: 'https://pravatar.cc',
      }
    ];

    for (const u of users) {
      // Avoid duplicates
      const exists = await userRepo.findOneBy({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash('Password123', 12);
      const user = userRepo.create({
        ...u,
        passwordHash: hashedPassword,
      });

      await userRepo.save(user);
      console.log(`Created user: ${u.email}`);
    }

    console.log("Seeding successful!");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();