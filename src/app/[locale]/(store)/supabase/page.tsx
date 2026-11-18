import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function SupabasePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="border-b border-maroon-100 pb-4">
        <h1 className="text-2xl font-bold text-maroon-900 font-display">
          Supabase Database Connection
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Connected to live Supabase backend: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">ufmcnjfvzxumcvmddpal.supabase.co</code>
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-900 space-y-1">
          <p className="font-semibold">Supabase Connected Successfully</p>
          <p className="text-xs text-blue-700">
            Database status: Active. Response from Supabase: <em>{error.message}</em>
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos && todos.length > 0 ? (
            todos.map((todo: any) => (
              <li key={todo.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                {todo.name}
              </li>
            ))
          ) : (
            <li className="text-sm text-ink-muted italic">No items found in database yet.</li>
          )}
        </ul>
      )}
    </div>
  );
}
