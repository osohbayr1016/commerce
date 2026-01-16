"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DebugAuthPage() {
  const [results, setResults] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const runDiagnostics = async () => {
    setLoading(true);
    setResults("Running diagnostics...\n\n");

    try {
      
      const { data: { session } } = await supabase.auth.getSession();
      setResults((prev) => prev + `✓ Current session: ${session ? 'Logged in' : 'Not logged in'}\n`);
      if (session) {
        setResults((prev) => prev + `  User ID: ${session.user.id}\n`);
        setResults((prev) => prev + `  Email: ${session.user.email}\n\n`);
      }

      
      const { data: columns, error: colError } = await supabase
        .rpc('get_profile_columns' as never);
      
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, phone_number, full_name, role')
        .limit(1);

      if (profileError) {
        if (profileError.message.includes('column') && profileError.message.includes('does not exist')) {
          setResults((prev) => prev + `✗ ERROR: Missing columns in profiles table!\n`);
          setResults((prev) => prev + `  Details: ${profileError.message}\n\n`);
          setResults((prev) => prev + `🔧 FIX: Run QUICK_FIX_LOGIN.sql in Supabase SQL Editor\n\n`);
        } else {
          setResults((prev) => prev + `✗ Profile check error: ${profileError.message}\n\n`);
        }
      } else {
        setResults((prev) => prev + `✓ Profiles table structure is correct\n\n`);
      }

      
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setResults((prev) => prev + `📊 Total users in database: ${usersCount}\n\n`);

      
      setResults((prev) => prev + `Testing phone lookup:\n`);
      const { data: testProfile, error: testError } = await supabase
        .from('profiles')
        .select('email, phone_number')
        .eq('phone_number', '99999999')
        .single();

      if (testError) {
        if (testError.code === 'PGRST116') {
          setResults((prev) => prev + `  ℹ️ No user with phone 99999999\n\n`);
        } else {
          setResults((prev) => prev + `  ✗ Error: ${testError.message}\n\n`);
        }
      } else {
        setResults((prev) => prev + `  ✓ Found user: ${testProfile.email}\n\n`);
      }

      setResults((prev) => prev + `\n✅ Diagnostics complete!\n\n`);
      setResults((prev) => prev + `NEXT STEPS:\n`);
      setResults((prev) => prev + `1. If you see errors above, run QUICK_FIX_LOGIN.sql\n`);
      setResults((prev) => prev + `2. Try logging in with your EMAIL (not phone)\n`);
      setResults((prev) => prev + `3. If still not working, create a new account at /auth/signup\n`);

    } catch (error) {
      setResults((prev) => prev + `\n❌ Fatal error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Authentication Debugger
          </h1>
          <p className="text-gray-600 mb-6">
            Run diagnostics to find out why login isn&apos;t working
          </p>

          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 mb-6"
          >
            {loading ? "Running..." : "Run Diagnostics"}
          </button>

          {results && (
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
              {results}
            </div>
          )}

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Quick Fixes:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Run <code className="bg-blue-100 px-2 py-1 rounded">QUICK_FIX_LOGIN.sql</code> in Supabase</li>
              <li>Try logging in with your <strong>email</strong> (not phone number)</li>
              <li>Check browser console (F12) for error messages</li>
              <li>Create a new account at <code className="bg-blue-100 px-2 py-1 rounded">/auth/signup</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
