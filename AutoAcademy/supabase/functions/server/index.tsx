import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase clients
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );
};

const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a96c109b/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-a96c109b/auth/signup", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm for demo purposes
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup exception:', error);
    return c.json({ error: 'Error creating user' }, 500);
  }
});

// Sign in user
app.post("/make-server-a96c109b/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      success: true,
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Signin exception:', error);
    return c.json({ error: 'Error signing in' }, 500);
  }
});

// Get current session
app.get("/make-server-a96c109b/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ session: null, profile: null });
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ session: null, profile: null });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return c.json({
      session: { user },
      profile: profile || { id: user.id, email: user.email, is_admin: false }
    });
  } catch (error) {
    console.error('Session check exception:', error);
    return c.json({ session: null, profile: null });
  }
});

// Sign out
app.post("/make-server-a96c109b/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: true });
    }

    const supabase = getSupabaseClient();
    await supabase.auth.signOut();

    return c.json({ success: true });
  } catch (error) {
    console.error('Signout exception:', error);
    return c.json({ error: 'Error signing out' }, 500);
  }
});

// ==================== COURSES ROUTES ====================

// Get all courses
app.get("/make-server-a96c109b/courses", async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ courses: data || [] });
  } catch (error) {
    console.error('Courses fetch exception:', error);
    return c.json({ error: 'Error fetching courses' }, 500);
  }
});

// Create course (admin only)
app.post("/make-server-a96c109b/courses", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseAdmin();

    // Verify admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const courseData = await c.req.json();

    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ course: data });
  } catch (error) {
    console.error('Course creation exception:', error);
    return c.json({ error: 'Error creating course' }, 500);
  }
});

// Update course (admin only)
app.put("/make-server-a96c109b/courses/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseAdmin();

    // Verify admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');
    const courseData = await c.req.json();

    const { data, error } = await supabase
      .from('courses')
      .update({ ...courseData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ course: data });
  } catch (error) {
    console.error('Course update exception:', error);
    return c.json({ error: 'Error updating course' }, 500);
  }
});

// Delete course (admin only)
app.delete("/make-server-a96c109b/courses/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseAdmin();

    // Verify admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const id = c.req.param('id');

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Course deletion exception:', error);
    return c.json({ error: 'Error deleting course' }, 500);
  }
});

// ==================== PACKAGES ROUTES ====================

// Get all packages
app.get("/make-server-a96c109b/packages", async (c) => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching packages:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ packages: data || [] });
  } catch (error) {
    console.error('Packages fetch exception:', error);
    return c.json({ error: 'Error fetching packages' }, 500);
  }
});

// ==================== CONTACT ROUTES ====================

// Submit contact message
app.post("/make-server-a96c109b/contact", async (c) => {
  try {
    const { name, email, message } = await c.req.json();
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }])
      .select()
      .single();

    if (error) {
      console.error('Error submitting contact message:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: data });
  } catch (error) {
    console.error('Contact submission exception:', error);
    return c.json({ error: 'Error submitting message' }, 500);
  }
});

// Get contact messages (admin only)
app.get("/make-server-a96c109b/contact", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseAdmin();

    // Verify admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ messages: data || [] });
  } catch (error) {
    console.error('Contact messages fetch exception:', error);
    return c.json({ error: 'Error fetching messages' }, 500);
  }
});

Deno.serve(app.fetch);