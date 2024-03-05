


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eggwshpjhyzbkeihfamh.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZ3dzaHBqaHl6YmtlaWhmYW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzODEyNjQsImV4cCI6MjAyMTk1NzI2NH0.isS8vF6JoT0WIqOtPTmmfK2t56pDVHIVEaeO4uAFGiU";


const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;