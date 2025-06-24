// app/api/delete-image/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const public_id = body?.public_id;

  if (!public_id) {
    return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== 'ok') {
      return NextResponse.json({ error: 'Delete failed', detail: result }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully', result });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return NextResponse.json({ error: 'Server error', detail: err }, { status: 500 });
  }
}
