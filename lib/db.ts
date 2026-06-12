import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

export type Booking = {
  id: string;
  mahasiswaId: string;
  mahasiswaName: string;
  counselorId: string;
  slot: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'mahasiswa' | 'konselor';
  receiverId: string;
  text: string;
  timestamp: string;
};

export type DbSchema = {
  bookings: Booking[];
  notifications: Notification[];
  chats: ChatMessage[];
};

const defaultDb: DbSchema = {
  bookings: [],
  notifications: [],
  chats: []
};

function initDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  }
}

export function readDb(): DbSchema {
  initDb();
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data) as DbSchema;
  } catch (e) {
    return defaultDb;
  }
}

export function writeDb(data: DbSchema) {
  initDb();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
