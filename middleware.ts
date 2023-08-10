import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

    const res = NextResponse.next()
    const supaClient = createMiddlewareClient({ req, res })

    await supaClient.auth.getSession()
    return res
} 