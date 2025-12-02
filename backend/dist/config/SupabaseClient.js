"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://lmiuootakedkmgalxtxc.supabase.co';
const supabaseKey = process.env.SUPABASE_ANONKEY;
if (!supabaseKey) {
    throw new Error('SUPABASE_ANONKEY environment variable is not set');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
