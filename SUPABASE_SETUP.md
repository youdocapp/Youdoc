# Supabase Setup Guide

## 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")
   - **service_role key** (optional, for server-side operations)

## 2. Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** 
- Variables prefixed with `EXPO_PUBLIC_` are accessible in client-side code
- `SUPABASE_SERVICE_ROLE_KEY` should ONLY be used on the server (backend)
- Never commit `.env` to version control (it's already in `.gitignore`)

## 3. Usage Examples

### Client-Side (React Native)

```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Query data
const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .eq('user_id', user.id);

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ column: 'value' });
```

### Server-Side (tRPC Backend)

```typescript
import { protectedProcedure } from '../create-context';
import { supabaseServer } from '../../lib/supabase-server';

export const getUserProfile = protectedProcedure.query(async ({ ctx }) => {
  // ctx.user is automatically available in protected procedures
  const { data, error } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', ctx.user.id)
    .single();
  
  if (error) throw error;
  return data;
});
```

## 4. Authentication Flow

The setup includes automatic authentication token handling:

1. **Client makes request** → Supabase session token is automatically attached
2. **Server receives request** → Token is validated and user is extracted
3. **Protected procedures** → Require authentication, throw error if not authenticated
4. **Public procedures** → Work without authentication

### Using Protected Procedures

```typescript
// In your tRPC router
import { protectedProcedure, publicProcedure } from '../create-context';

export const exampleRouter = createTRPCRouter({
  // Anyone can call this
  public: publicProcedure.query(() => {
    return { message: 'Hello world' };
  }),
  
  // Only authenticated users can call this
  protected: protectedProcedure.query(({ ctx }) => {
    return { 
      message: `Hello ${ctx.user.email}`,
      userId: ctx.user.id 
    };
  }),
});
```

## 5. Database Setup

Create tables in Supabase:

```sql
-- Example: User profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policy: Users can only read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Create policy: Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

## 6. Testing the Connection

```typescript
// Test in your app
import { supabase } from '@/lib/supabase';

const testConnection = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log('Supabase connected:', !error);
};
```

## 7. Common Issues

### Issue: "Invalid API key"
- Check that your `.env` file has the correct keys
- Restart your development server after adding environment variables

### Issue: "Row Level Security" errors
- Make sure you've set up RLS policies in Supabase
- Check that your policies match your use case

### Issue: Authentication not persisting
- The setup uses AsyncStorage for session persistence
- Make sure `@react-native-async-storage/async-storage` is installed

## 8. Next Steps

1. Set up your database schema in Supabase
2. Configure Row Level Security policies
3. Update your auth context to use Supabase
4. Create tRPC procedures for your app's functionality

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
