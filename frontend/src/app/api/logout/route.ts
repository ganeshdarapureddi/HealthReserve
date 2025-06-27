import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request :Request) {
  const cookieStore =await cookies();
  cookieStore.delete('token');
  cookieStore.delete('userId');
  cookieStore.delete('userRole');

  return NextResponse.redirect(new URL('/expire',request.url));
}

//cookies deletion can be possible only in server actions or route handlers
//In server action also you can delete only if you doing some action like click button may be from form action or use action state
//So we are using route handlers for this that iam going to redirect to specific route called logout which makes the deletion and
// redirection here