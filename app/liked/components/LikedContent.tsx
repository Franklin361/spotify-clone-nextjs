"use client";

import LikedButton from '@/components/LikedButton';
import MediaItem from '@/components/MediaItem';
import { useUser } from '@/hooks/useUser';
import { Song } from '@/types'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
    songs: Song[]
}

const LikedContent = ({ songs }: Props) => {

    const router = useRouter()
    const { user, isLoading } = useUser()

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/')
        }

    }, [isLoading, user, router])

    if (songs.length === 0) return (
        <div className='flex flex-col gap-y-2 w-full px-6 text-neutral-400'>No liked songs </div>
    )


    return (
        <div className='flex flex-col gap-y-2 w-full px-6'>
            {
                songs.map(song => (
                    <div
                        key={song.id}
                        className='flex items-center gap-x-4 w-full'
                    >
                        <div className='flex-1'>
                            <MediaItem data={song} onClick={() => { }} />
                        </div>
                        <LikedButton songId={song.id} />
                    </div>
                ))
            }
        </div>
    )
}
export default LikedContent