(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,37422,e=>{"use strict";var s=e.i(43476),i=e.i(71645),n=e.i(11795);function r(){let[e,r]=(0,i.useState)(""),[a,t]=(0,i.useState)(!1),l=(0,n.createClient)(),o=async()=>{t(!0),r("Running diagnostics...\n\n");try{let{data:{session:e}}=await l.auth.getSession();r(s=>s+`✓ Current session: ${e?"Logged in":"Not logged in"}
`),e&&(r(s=>s+`  User ID: ${e.user.id}
`),r(s=>s+`  Email: ${e.user.email}

`));let{data:s,error:i}=await l.rpc("get_profile_columns"),{data:n,error:a}=await l.from("profiles").select("id, email, phone_number, full_name, role").limit(1);a?a.message.includes("column")&&a.message.includes("does not exist")?(r(e=>e+`✗ ERROR: Missing columns in profiles table!
`),r(e=>e+`  Details: ${a.message}

`),r(e=>e+`🔧 FIX: Run QUICK_FIX_LOGIN.sql in Supabase SQL Editor

`)):r(e=>e+`✗ Profile check error: ${a.message}

`):r(e=>e+`✓ Profiles table structure is correct

`);let{count:t}=await l.from("profiles").select("*",{count:"exact",head:!0});r(e=>e+`📊 Total users in database: ${t}

`),r(e=>e+`Testing phone lookup:
`);let{data:o,error:c}=await l.from("profiles").select("email, phone_number").eq("phone_number","99999999").single();c?"PGRST116"===c.code?r(e=>e+`  ℹ️ No user with phone 99999999

`):r(e=>e+`  ✗ Error: ${c.message}

`):r(e=>e+`  ✓ Found user: ${o.email}

`),r(e=>e+`
✅ Diagnostics complete!

`),r(e=>e+`NEXT STEPS:
`),r(e=>e+`1. If you see errors above, run QUICK_FIX_LOGIN.sql
`),r(e=>e+`2. Try logging in with your EMAIL (not phone)
`),r(e=>e+`3. If still not working, create a new account at /auth/signup
`)}catch(e){r(s=>s+`
❌ Fatal error: ${e}
`)}finally{t(!1)}};return(0,s.jsx)("div",{className:"min-h-screen bg-gray-50 py-12 px-4",children:(0,s.jsx)("div",{className:"max-w-4xl mx-auto",children:(0,s.jsxs)("div",{className:"bg-white rounded-lg shadow-lg p-8",children:[(0,s.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-4",children:"🔍 Authentication Debugger"}),(0,s.jsx)("p",{className:"text-gray-600 mb-6",children:"Run diagnostics to find out why login isn't working"}),(0,s.jsx)("button",{onClick:o,disabled:a,className:"px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 mb-6",children:a?"Running...":"Run Diagnostics"}),e&&(0,s.jsx)("div",{className:"bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap",children:e}),(0,s.jsxs)("div",{className:"mt-8 p-6 bg-blue-50 rounded-lg",children:[(0,s.jsx)("h3",{className:"font-bold text-blue-900 mb-2",children:"Quick Fixes:"}),(0,s.jsxs)("ol",{className:"list-decimal list-inside space-y-2 text-blue-800",children:[(0,s.jsxs)("li",{children:["Run ",(0,s.jsx)("code",{className:"bg-blue-100 px-2 py-1 rounded",children:"QUICK_FIX_LOGIN.sql"})," in Supabase"]}),(0,s.jsxs)("li",{children:["Try logging in with your ",(0,s.jsx)("strong",{children:"email"})," (not phone number)"]}),(0,s.jsx)("li",{children:"Check browser console (F12) for error messages"}),(0,s.jsxs)("li",{children:["Create a new account at ",(0,s.jsx)("code",{className:"bg-blue-100 px-2 py-1 rounded",children:"/auth/signup"})]})]})]})]})})})}e.s(["default",()=>r])}]);