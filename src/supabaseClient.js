import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rnafyyzvxwzoeoxtbryi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuYWZ5eXp2eHd6b2VveHRicnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTg3MTYsImV4cCI6MjA5NjAzNDcxNn0.Rig2mxOj2p1pbSj5V-Pumh-AfdiMbWgJxDW46TwXDO4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
