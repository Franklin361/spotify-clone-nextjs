"use client";
import qs from 'query-string'
import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Input from './Input';

const SearchInput = () => {

    const router = useRouter();
    const [value, setValue] = useState("")
    const debounceValue = useDebounce(value)

    useEffect(() => {

        const query = {
            title: debounceValue
        }

        const url = qs.stringifyUrl({
            url: '/search',
            query
        })

        router.push(url)

    }, [debounceValue, router])


    return (
        <>
            <Input
                placeholder='What do you want to listen to?'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </>
    )
}
export default SearchInput