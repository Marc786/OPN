import { Employee } from '@/lib/domain/entities/employee.entity';
import { IEmployeeRepository } from '@/lib/domain/ports/employee.repository.port';
import { getDb } from '../db/mongo';

export class MongoEmployeeRepository implements IEmployeeRepository {
  private readonly collectionName = 'employees';

  private async collection() {
    const db = await getDb();
    return db.collection<Employee>(this.collectionName);
  }

  async findByEmployeeNumber(employeeNumber: string): Promise<Employee | null> {
    const col = await this.collection();
    return col.findOne({ employeeNumber });
  }

  async save(employee: Employee): Promise<Employee> {
    const col = await this.collection();
    await col.insertOne({ ...employee });
    return employee;
  }

  async updateTab(
    employeeNumber: string,
    tab: number
  ): Promise<Employee | null> {
    const col = await this.collection();
    const result = await col.findOneAndUpdate(
      { employeeNumber },
      { $set: { tab } },
      { returnDocument: 'after' }
    );
    return result ?? null;
  }
}

export const employeeRepository = new MongoEmployeeRepository();
