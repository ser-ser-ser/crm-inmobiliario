import { supabase } from './lib/supabaseClient'

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'serapiography@gmail.com',
    password: 'admin123'
  })
  console.log({ data, error })
}

testLogin()
