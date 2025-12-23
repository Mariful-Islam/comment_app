import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { Keyword } from '@/models/Keyword';

export async function GET(
  _req: Request,
  { params }: { params: any }
) {
  try {
    await connectToDB();

    const { userId } = await params;
    
    const keywords = await Keyword.find({ userId: userId });

    return NextResponse.json(keywords, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}






// // ✅ Update a keyword
// export async function PATCH(req: Request, { params }: { params: any }) {
//   try {
//     await connectToDB();
//     const { userId } = await params

//     const body = await req.json();

//     const { postId, keyword, comment, message } = body;

//     if (!userId && !postId) {
//       return NextResponse.json(
//         { message: 'Keyword ID or postId is required' },
//         { status: 400 }
//       );
//     }

//     // Find by id (preferred) or by postId + keyword
//     const filter = { userId: userId } 

//     const updatedKeyword = await Keyword.findOneAndUpdate(
//       filter,
//       { keyword, comment, message },
//       { new: true }
//     );

//     if (!updatedKeyword) {
//       return NextResponse.json(
//         { message: 'Keyword not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedKeyword, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }






// export async function DELETE(
//   req: Request,
//   { params }: { params:  any }
// ) {
//   try {
//     await connectToDB()

//     const { _is } = await params

//     if (!userId) {
//       return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
//     }

//     // Find and delete by MongoDB _id
//     const deleted = await Keyword.findOneAndDelete({ userId: userId })

//     if (!deleted) {
//       return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
//     }

//     return NextResponse.json({ message: 'Keyword deleted successfully' })
//   } catch (error) {
//     console.error('Error deleting keyword:', error)
//     return NextResponse.json(
//       { error: 'Server error while deleting keyword' },
//       { status: 500 }
//     )
//   }
// }