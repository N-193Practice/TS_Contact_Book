import { saveContacts } from './localStorage';
import Contact from '../models/Contact.ts';

// テストデータを直接定義
const testData: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '123-456-7890',
    memo: 'Friend from college',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '987-654-3210',
    memo: 'Work colleague',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    phone: '555-123-4567',
    memo: 'Gym buddy',
  },
  {
    id: '4',
    name: 'やまだ たろう',
    phone: '555-123-4567',
    memo: 'Gym buddy',
  },
];

export function insertTestData() {
  saveContacts(testData);
}
