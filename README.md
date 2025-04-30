# Supabase Mini-Project: Custom Note Service

## Objectives
- **Design a simple table schema** for storing notes.
- **Implement two REST endpoints** as Supabase Edge Functions:
  - `POST /notes` to insert a new note.
  - `GET /notes` to return all notes.

---

## Setup & Deployment Steps

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and **sign up** or **log in** if you already have an account.
2. Click on **Create a new project**.
3. Fill in the details:
   - **Project name**: Choose a name for your project (e.g., `note-taking-app`).
   - **Database password**: Choose a strong password for your database.
   - **Region**: Choose a region close to your location for optimal performance.
4. Click **Create new project** and wait for the project to be set up.

### 2. Get Supabase API URL and Key
After the project is created:
1. Navigate to your **Supabase Dashboard** for the newly created project.
2. Go to **Project Settings** (the gear icon).
3. Under **API**, you'll find:
   - **Project URL** (this is the Supabase URL for your project).
   - **anon public API key** (this will be used to interact with the project from the front end).

### 3. Configure Environment Variables
In your deployment platform, you'll need to set the following environment variables to securely connect to Supabase:

- **SUPABASE_URL**: The URL for your Supabase project.
- **SUPABASE_KEY**: The public API key (or service role key for server-side access).

you can add the following:

```bash
supabase secrets set PROJECT_URL=https://<your-supabase-url>.supabase.co
supabase secrets set SERVICE_ROLE_KEY=your-anon-api-key
```
### 5. Set Up and Deploy Supabase Edge Functions

#### Step 1: Create Edge Functions in Supabase
1. In the Supabase dashboard, navigate to the **Edge Functions** section under the **"Functions"** tab.
2. Click **Create a new function**.
3. Choose the function language (JavaScript or TypeScript).
4. Add the function files (`post_notes.js` and `get_notes.js`), based on your project.

#### Step 2: Code the Functions

- **`post_notes.js`**
```js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    const supabaseUrl = Deno.env.get("PROJECT_URL");
    const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Missing title or content" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Note added", data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

```

- **`get_notes.js`**
```js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Get Supabase URL and Service Role Key from environment variables
  const supabaseUrl = Deno.env.get("PROJECT_URL");
  const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY");

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle GET request
  if (req.method === "GET") {
    // Fetch data from the "notes" table
    const { data, error } = await supabase.from("notes").select("*");

    // Handle errors if any
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the notes data as JSON response
    return new Response(JSON.stringify({ notes: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If the method is not GET, return "Method not allowed"
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
});

```

- **`schema.sql`**

```sql

create table notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  created_at timestamp default now()
);

```
### Why?
- **UUID** is used as the primary key to avoid collisions and ensure global uniqueness.
- **TEXT** type allows for flexible and variable-length content in both title and content.
- **TIMESTAMP** with `now()` records the creation time of each note without needing explicit input.

#### Step 3: Deploy the Functions
1. After writing the functions, click on **Deploy** in the Supabase dashboard to deploy them to your project.
2. Supabase will provide you with **URLs** for each deployed function (e.g., `/functions/v1/post_notes` and `/functions/v1/get_notes`).

---

### 6. Testing the Functions

#### Create a note (POST /notes)

```bash
curl -X POST https://your-supabase-url.supabase.co/functions/v1/post_notes \
-H "Authorization: Bearer your-anon-key" \
-H "Content-Type: application/json" \
-d '{"title": "Sample Note", "content": "This is the content of the note."}'
```

**Expected Response:**
```json
{
  "message": "Note added"
}
```

#### List notes (GET /notes)

```bash
curl -X GET "https://your_supabase_url.supabase.co/functions/v1/get_notes" \
-H "Authorization: Bearer your-anon-key"
```

**Expected Response:**
```json
{
  "notes": [
    {
      "id": "note-id-1",
      "title": "Sample Note",
      "content": "This is the content of the note.",
      "created_at": "2025-04-30T12:00:00.000Z"
    }
  ]
}
```

---


# Supabase Project Setup Instructions

Follow these steps to set up your Supabase project locally, deploy your edge functions, and start the local development environment.

---

## 1. Clone the GitHub Repository

```bash
git clone https://github.com/ShoreNexx/Custom-Note-Service-Backend-.git
cd Custom-Note-Service-Backend
```


---

## 2. Install the Supabase CLI



## 3. Initialize a Supabase Project

Run the following command to initialize a Supabase project in your local directory:

```bash
supabase init
```

This command creates a `supabase/` directory with configuration files.

---

## 4. Link Your Supabase Project

Link your local project to an existing Supabase project:

```bash
supabase link --project-ref your-project-ref
```


---

## 5. Deploy Edge Functions

Deploy the two required edge functions using the following commands:

```bash
supabase functions deploy post_notes
supabase functions deploy get_notes
```

---

## 6. Start Supabase Locally

Start the Supabase local development environment:

```bash
supabase start
```

This runs Supabase services locally using Docker.

---

## 7. Push Schema to Local Supabase

Once Supabase is running, push your schema to the local database:

```bash
supabase db push
```

This applies your `schema.sql` changes to the local development database.

---

## Done! 🎉


