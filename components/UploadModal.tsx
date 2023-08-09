"use client";

import useUploadModal from '@/hooks/useUploadModal';
import uniqid from 'uniqid';
import Modal from './Modal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { toast } from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
    const [isLoading, setisLoading] = useState(false)
    const uploadModal = useUploadModal()
    const supabaseClient = useSupabaseClient()
    const { user } = useUser()

    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null
        }
    })

    const onChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            uploadModal.onClose()
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {

        try {
            setisLoading(true)

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!user || !songFile || !imageFile) {
                toast.error('Missing fields')
                return
            }

            const uniqueId = uniqid()
            // Upload song to storeage
            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueId}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (songError) {
                setisLoading(false)
                return toast.error('Failed song upload')
            }

            // Upload image to storeage
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueId}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (imageError) {
                setisLoading(false)
                return toast.error('Failed image upload')
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path,
                })

            if (supabaseError) {
                setisLoading(false)
                return toast.error(supabaseError.message)
            }

            router.refresh()
            setisLoading(false)
            toast.success('Song created!')
            reset();
            uploadModal.onClose()

        } catch (error) {
            toast.error('Somenting went wrong')
        } finally {
            setisLoading(false)
        }
    }

    return (
        <Modal
            title='Add your song'
            description='Upload an .mp3 file'
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-y-4'
            >
                <Input
                    disabled={isLoading}
                    id='title'
                    {...register('title', { required: true })}
                    placeholder='Song title'
                />
                <Input
                    disabled={isLoading}
                    id='author'
                    {...register('author', { required: true })}
                    placeholder='Song author'
                />

                <div>
                    <div className='pb-1'>
                        Select a song file
                    </div>
                    <Input
                        disabled={isLoading}
                        id='song'
                        type='file'
                        accept='.mp3'
                        {...register('song', { required: true })}
                    />
                </div>

                <div>
                    <div className='pb-1'>
                        Select an image
                    </div>
                    <Input
                        disabled={isLoading}
                        type='file'
                        id='image'
                        accept='image/*'
                        {...register('image', { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type='submit'>
                    Create
                </Button>
            </form>
        </Modal>
    )
}
export default UploadModal