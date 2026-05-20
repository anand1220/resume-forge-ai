import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://venpkmttbkhvzeovzgmq.supabase.co'; // Supabase dashboard se uthao
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbnBrbXR0Ymtodnplb3Z6Z21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzAxMjMsImV4cCI6MjA5NDc0NjEyM30.j72FPmjG-3lD6F-0yE4oCVa8rnRsJaUL5jiZbBNa9hE'; // Supabase dashboard se uthao

export const supabase = createClient(supabaseUrl, supabaseAnonKey);