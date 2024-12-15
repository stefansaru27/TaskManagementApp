import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';

export interface Task {
  id?: string;
  name: string;
  description: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  birthday?: string;
  phoneNumber?: string;
  aboutMe?: string;
  role: string;
  notifyEmail: boolean;
  notifySms: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private tasksCollection = this.firestore.collection<Task>('tasks');
  private usersCollection = this.firestore.collection<User>('users');

  constructor(private firestore: AngularFirestore) {}

  // TASK MANAGEMENT METHODS

  getTasks(): Observable<Task[]> {
    return this.tasksCollection.valueChanges({ idField: 'id' });
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasksCollection.doc(id).valueChanges();
  }

  addTask(task: Task): Promise<void> {
    const id = this.firestore.createId();
    const timestamp = new Date();
    return this.tasksCollection
      .doc(id)
      .set({ ...task, id, createdAt: timestamp, updatedAt: timestamp });
  }

  updateTask(id: string, task: Partial<Task>): Promise<void> {
    const timestamp = new Date();
    return this.tasksCollection
      .doc(id)
      .update({ ...task, updatedAt: timestamp });
  }

  deleteTask(id: string): Promise<void> {
    return this.tasksCollection.doc(id).delete();
  }

  // USER MANAGEMENT METHODS

  addUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    const timestamp = new Date();
    return this.usersCollection
      .doc(userId)
      .set({ ...userData, createdAt: timestamp, updatedAt: timestamp });
  }

  getUser(userId: string): Observable<User | undefined> {
    return this.usersCollection.doc(userId).valueChanges();
  }

  updateUser(userId: string, userData: Partial<User>): Promise<void> {
    const timestamp = new Date();
    return this.usersCollection
      .doc(userId)
      .update({ ...userData, updatedAt: timestamp });
  }

  deleteUser(userId: string): Promise<void> {
    return this.usersCollection.doc(userId).delete();
  }

  // GENERIC DELETE METHOD

  deleteDocument(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }

  // TASK PAGINATION

  getTasksWithPagination(
    limit: number,
    startAfter?: string
  ): Observable<Task[]> {
    const query = this.tasksCollection.ref.orderBy('createdAt').limit(limit);

    if (startAfter) {
      query.startAfter(startAfter);
    }

    return from(
      query
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data() as Task))
    );
  }
}
