import { Song } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

const getSongs = async (): Promise<Song[]> => {

    const supabase = createServerComponentClient({
        // headers,
        cookies
    })

    const {
        data, error
    } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) { console.log(error) }

    return (data as any) || []
}

export default getSongs