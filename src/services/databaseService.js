import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

export class DatabaseService {
  constructor() {
    this.supabase = null;
    this.sql = null;
  }

  init() {
    // Create postgres client (auto-connects)
    const connectionString = process.env.DATABASE_URL;
    this.sql = postgres(connectionString, {
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false }
    });

  }

  async ensureConnection() {
    if (!this.sql) {
      this.init();
    }
  }

  async query(text, params = []) {
    try {
      await this.ensureConnection();

      if (!this.sql) {
        throw new Error('Database not connected');
      }

      // postgres library uses tagged template, so we map params in
      const result = await this.sql.unsafe(text, params);
      
      // Ensure we always return an object with rows property for compatibility
      if (Array.isArray(result)) {
        return { rows: result };
      } else if (result && typeof result === 'object' && 'rows' in result) {
        return result;
      } else {
        return { rows: result || [] };
      }
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  async close() {
    if (this.sql) {
      await this.sql.end({ timeout: 5 }); // clean shutdown
      this.sql = null;
    }
  }

  // Supabase methods for auth and real-time features
  async ensureSupabase() {
    if (!this.supabase) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
    }
  }

  getSupabase() {
    if (!this.supabase) {
      throw new Error('Supabase not initialized. Call ensureSupabase() first.');
    }
    return this.supabase;
  }

  async getUser(userId) {
    await this.ensureSupabase();

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async createUser(userData) {
    await this.ensureSupabase();

    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}
