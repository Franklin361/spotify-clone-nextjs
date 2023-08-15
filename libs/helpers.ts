import { Price } from '../types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL

export const getURL = () => {
    let url =
        SITE_URL ??
        VERCEL_URL ??
        'http://localhost:3000/'

    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

    console.log({ SITE_URL, VERCEL_URL })

    return url
}

interface PropsData {
    url: string
    data?: { price: Price }
}

export const postData = async ({ data, url }: PropsData) => {
    const res: Response = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        console.log('Error in POST', { url, data, res })
        throw new Error(res.statusText);
    }

    return res.json()
}

export const toDateTime = (secs: number) => {
    var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
    t.setSeconds(secs);
    return t;
};

